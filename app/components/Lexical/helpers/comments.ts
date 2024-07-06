import { useEffect, useState } from 'react';

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { $isRootTextContentEmpty, $rootTextContent } from '@lexical/text';
import { Provider, TOGGLE_CONNECT_COMMAND } from '@lexical/yjs';
import type { EditorState, LexicalEditor } from 'lexical';
import { COMMAND_PRIORITY_LOW } from 'lexical';
import { Transaction, Array as YArray, YArrayEvent, YEvent, Map as YMap } from 'yjs';

export type Comment = {
  author: string;
  content: string;
  deleted: boolean;
  id: string;
  timeStamp: number;
  type: 'comment';
};

export type Thread = {
  comments: Comment[];
  id: string;
  quote: string;
  color: string;
  type: 'thread';
};

export type Comments = (Thread | Comment)[];

export function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
}

export const handleOnChange = (editorState: EditorState, _editor: LexicalEditor) => {
  return editorState.read(() => {
    const text = $rootTextContent();
    const canSubmit = !$isRootTextContentEmpty(_editor.isComposing(), true);
    return { text, canSubmit };
  });
};

export function useCollabAuthorName(
  namespace: string,
  userData: { username: string; color: string }
): { name: string; color: string } {
  const collabContext = useCollaborationContext(userData.username, userData.color);
  const { yjsDocMap, name, color } = collabContext;
  return yjsDocMap.has(namespace + '_comments') ? { name, color } : { name: userData.username, color: userData.color };
}

export function useCommentStore(commentStore: CommentStore): Comments {
  const [comments, setComments] = useState<Comments>(commentStore.getComments());
  useEffect(() => {
    commentStore.registerOnChange(() => {
      setComments(commentStore.getComments());
    });
  }, [commentStore]);

  return comments;
}

export function createComment(props: {
  content: string;
  author: string;
  id?: string;
  timeStamp?: number;
  deleted?: boolean;
}): Comment {
  const { content, author, id = undefined, timeStamp = undefined, deleted = undefined } = props;
  return {
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    id: id === undefined ? createUID() : id,
    timeStamp: timeStamp === undefined ? Date.now() : timeStamp,
    type: 'comment'
  };
}

export function createThread(props: { quote: string; comments: Array<Comment>; id?: string; color: string }): Thread {
  const { quote, comments, id = undefined, color = 'bg-pastel-yellow' } = props;
  return {
    comments,
    id: id === undefined ? createUID() : id,
    quote,
    color,
    type: 'thread'
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    comments: Array.from(thread.comments),
    id: thread.id,
    quote: thread.quote,
    color: thread.color,
    type: 'thread'
  };
}

function markDeleted(comment: Comment): Comment {
  return {
    author: comment.author,
    content: '[Deleted Comment]',
    deleted: true,
    id: comment.id,
    timeStamp: comment.timeStamp,
    type: 'comment'
  };
}

function triggerOnChange(commentStore: CommentStore): void {
  const listeners = commentStore._changeListeners;
  for (const listener of listeners) {
    listener();
  }
}

export class CommentStore {
  _editor: LexicalEditor;
  _comments: Comments;
  _changeListeners: Set<() => void>;
  _collabProvider: null | Provider;

  constructor(editor: LexicalEditor) {
    this._comments = [];
    this._editor = editor;
    this._collabProvider = null;
    this._changeListeners = new Set();
  }

  isCollaborative(): boolean {
    return this._collabProvider !== null;
  }

  getComments(): Comments {
    return this._comments;
  }

  addComment(namespace: string, commentOrThread: Comment | Thread, thread?: Thread, offset?: number): void {
    const nextComments = Array.from(this._comments);
    // The YJS types explicitly use `any` as well.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedCommentsArray: YArray<any> | null = this._getCollabComments(namespace);

    if (thread !== undefined && commentOrThread.type === 'comment') {
      for (let i = 0; i < nextComments.length; i++) {
        const comment = nextComments[i];
        if (comment.type === 'thread' && comment.id === thread.id) {
          const newThread = cloneThread(comment);
          nextComments.splice(i, 1, newThread);
          const insertOffset = offset !== undefined ? offset : newThread.comments.length;
          if (this.isCollaborative() && sharedCommentsArray !== null) {
            const parentSharedArray = sharedCommentsArray.get(i).get(namespace + '_comments');
            this._withRemoteTransaction(() => {
              const sharedMap = this._createCollabSharedMap(namespace, commentOrThread);
              parentSharedArray.insert(insertOffset, [sharedMap]);
            });
          }
          newThread.comments.splice(insertOffset, 0, commentOrThread);
          break;
        }
      }
    } else {
      const insertOffset = offset !== undefined ? offset : nextComments.length;
      if (this.isCollaborative() && sharedCommentsArray !== null) {
        this._withRemoteTransaction(() => {
          const sharedMap = this._createCollabSharedMap(namespace, commentOrThread);
          sharedCommentsArray.insert(insertOffset, [sharedMap]);
        });
      }
      nextComments.splice(insertOffset, 0, commentOrThread);
    }
    this._comments = nextComments;
    triggerOnChange(this);
  }

  deleteCommentOrThread(
    namespace: string,
    commentOrThread: Comment | Thread,
    thread?: Thread
  ): { markedComment: Comment; index: number } | null {
    const nextComments = Array.from(this._comments);
    // The YJS types explicitly use `any` as well.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedCommentsArray: YArray<any> | null = this._getCollabComments(namespace);
    let commentIndex: number | null = null;

    if (thread !== undefined) {
      for (let i = 0; i < nextComments.length; i++) {
        const nextComment = nextComments[i];
        if (nextComment.type === 'thread' && nextComment.id === thread.id) {
          const newThread = cloneThread(nextComment);
          nextComments.splice(i, 1, newThread);
          const threadComments = newThread.comments;
          commentIndex = threadComments.indexOf(commentOrThread as Comment);
          if (this.isCollaborative() && sharedCommentsArray !== null) {
            const parentSharedArray = sharedCommentsArray.get(i).get(namespace + '_comments');
            this._withRemoteTransaction(() => {
              parentSharedArray.delete(commentIndex);
            });
          }
          threadComments.splice(commentIndex, 1);
          break;
        }
      }
    } else {
      commentIndex = nextComments.indexOf(commentOrThread);
      if (this.isCollaborative() && sharedCommentsArray !== null) {
        this._withRemoteTransaction(() => {
          sharedCommentsArray.delete(commentIndex as number);
        });
      }
      nextComments.splice(commentIndex, 1);
    }
    this._comments = nextComments;
    triggerOnChange(this);

    if (commentOrThread.type === 'comment') {
      return {
        index: commentIndex as number,
        markedComment: markDeleted(commentOrThread as Comment)
      };
    }

    return null;
  }

  registerOnChange(onChange: () => void): () => void {
    const changeListeners = this._changeListeners;
    changeListeners.add(onChange);
    return () => {
      changeListeners.delete(onChange);
    };
  }

  _withRemoteTransaction(fn: () => void): void {
    const provider = this._collabProvider;
    if (provider !== null) {
      // @ts-expect-error doc does exist
      const doc = provider.rootDoc;
      doc.transact(fn, this);
    }
  }

  _withLocalTransaction(fn: () => void): void {
    const collabProvider = this._collabProvider;
    try {
      this._collabProvider = null;
      fn();
    } finally {
      this._collabProvider = collabProvider;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getCollabComments(namespace: string): null | YArray<any> {
    const provider = this._collabProvider;
    if (provider !== null) {
      // @ts-expect-error doc does exist
      const doc = provider.rootDoc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return doc.get(namespace + '_comments', YArray) as YArray<any>;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _createCollabSharedMap(namespace: string, commentOrThread: Comment | Thread): YMap<any> {
    const sharedMap = new YMap();
    const type = commentOrThread.type;
    const id = commentOrThread.id;
    sharedMap.set('type', type);
    sharedMap.set('id', id);
    if (type === 'comment') {
      sharedMap.set('author', commentOrThread.author);
      sharedMap.set('content', commentOrThread.content);
      sharedMap.set('deleted', commentOrThread.deleted);
      sharedMap.set('timeStamp', commentOrThread.timeStamp);
    } else {
      sharedMap.set('quote', commentOrThread.quote);
      sharedMap.set('color', commentOrThread.color);
      const commentsArray = new YArray();
      commentOrThread.comments.forEach((comment, i) => {
        const sharedChildComment = this._createCollabSharedMap(namespace, comment);
        commentsArray.insert(i, [sharedChildComment]);
      });
      sharedMap.set(namespace + '_comments', commentsArray);
    }
    return sharedMap;
  }

  registerCollaboration(provider: Provider, namespace: string): () => void {
    this._collabProvider = provider;
    const sharedCommentsArray = this._getCollabComments(namespace);
    const connect = () => {
      provider.connect();
    };

    const disconnect = () => {
      try {
        provider.disconnect();
      } catch (e) {
        // Do nothing
      }
    };

    const unsubscribe = this._editor.registerCommand(
      TOGGLE_CONNECT_COMMAND,
      payload => {
        if (connect !== undefined && disconnect !== undefined) {
          const shouldConnect = payload;

          if (shouldConnect) {
            // eslint-disable-next-line no-console
            console.log('Comments connected!');
            connect();
          } else {
            // eslint-disable-next-line no-console
            console.log('Comments disconnected!');
            disconnect();
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const onSharedCommentChanges = (
      // The YJS types explicitly use `any` as well.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events: Array<YEvent<any>>,
      transaction: Transaction
    ) => {
      if (transaction.origin !== this) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];

          if (event instanceof YArrayEvent) {
            const target = event.target;
            const deltas = event.delta;
            let offset = 0;

            for (let s = 0; s < deltas.length; s++) {
              const delta = deltas[s];
              const insert = delta.insert;
              const retain = delta.retain;
              const del = delta.delete;
              const parent = target.parent;
              const parentThread =
                target === sharedCommentsArray
                  ? undefined
                  : parent instanceof YMap &&
                    (this._comments.find(t => t.id === parent.get('id')) as Thread | undefined);

              if (Array.isArray(insert)) {
                insert
                  .slice()
                  .reverse()
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .forEach((map: YMap<any>) => {
                    const id = map.get('id');
                    const type = map.get('type');

                    const commentOrThread =
                      type === 'thread'
                        ? createThread({
                            quote: map.get('quote'),
                            comments: map
                              .get(namespace + '_comments')
                              .toArray()
                              .map((innerComment: Map<string, string | number | boolean>) =>
                                createComment({
                                  content: innerComment.get('content') as string,
                                  author: innerComment.get('author') as string,
                                  id: innerComment.get('id') as string,
                                  timeStamp: innerComment.get('timeStamp') as number,
                                  deleted: innerComment.get('deleted') as boolean
                                })
                              ),
                            id,
                            color: map.get('color')
                          })
                        : createComment({
                            content: map.get('content'),
                            author: map.get('author'),
                            id,
                            timeStamp: map.get('timeStamp'),
                            deleted: map.get('deleted')
                          });
                    this._withLocalTransaction(() => {
                      this.addComment(namespace, commentOrThread, parentThread as Thread, offset);
                    });
                  });
              } else if (typeof retain === 'number') {
                offset += retain;
              } else if (typeof del === 'number') {
                for (let d = 0; d < del; d++) {
                  const commentOrThread =
                    parentThread === undefined || parentThread === false
                      ? this._comments[offset]
                      : parentThread.comments[offset];
                  this._withLocalTransaction(() => {
                    this.deleteCommentOrThread(namespace, commentOrThread, parentThread as Thread);
                  });
                  offset++;
                }
              }
            }
          }
        }
      }
    };

    if (sharedCommentsArray === null) {
      return () => null;
    }

    sharedCommentsArray.observeDeep(onSharedCommentChanges);
    connect();

    return () => {
      sharedCommentsArray.unobserveDeep(onSharedCommentChanges);
      unsubscribe();
      this._collabProvider = null;
    };
  }
}
