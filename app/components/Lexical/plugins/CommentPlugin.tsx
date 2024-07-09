import { useOutletContext } from '@remix-run/react';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode
} from '@lexical/mark';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, registerNestedElementResolver } from '@lexical/utils';
import { Provider } from '@lexical/yjs';
import type { LexicalCommand, NodeKey, RangeSelection } from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand
} from 'lexical';
import { Doc } from 'yjs';

import { ActiveUserProfile } from '~/routes/dash.page.$page_id/components/PageRichTextEditor';

import AddCommentBox from '../components/AddCommentBox';
import CommentInputModal from '../components/CommentInputModal';
import CommentsPanel from '../components/CommentsPanel';
import { Comment, CommentStore, Thread, useCollabAuthorName, useCommentStore } from '../helpers/comments';
import { DashOutletContext } from '~/routes/dash/route';

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand('INSERT_INLINE_COMMAND');

export default function CommentPlugin({
  namespace,
  userData,
  providerFactory
}: {
  namespace: string;
  userData: ActiveUserProfile;
  providerFactory?: (id: string, yjsDocMap: Map<string, Doc>) => Provider;
}): JSX.Element {
  const { scrollLock, setScrollLock } = useOutletContext<DashOutletContext>();

  const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>();
  const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [init, setInit] = useState(false);

  const [editor] = useLexicalComposerContext();
  const commentStore = useMemo(() => new CommentStore(editor), [editor]);
  const comments = useCommentStore(commentStore);
  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map();
  }, []);
  const collabContext = useCollaborationContext();
  const authorDetails = useCollabAuthorName(namespace, userData);
  const { yjsDocMap } = collabContext;
  const mapKeys = Array.from(markNodeMap, ([name]) => name);

  useEffect(() => {
    if (providerFactory) {
      const provider = providerFactory(namespace + '_comments', yjsDocMap);
      return commentStore.registerCollaboration(provider, namespace);
    }
  }, [commentStore, providerFactory, yjsDocMap, namespace]);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];
    activeIDs.map(id => {
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.classList.add('selected');
            changedElems.push(elem);
          }
        }
      }
    });
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i];
        changedElem.classList.remove('selected');
      }
    };
  }, [activeIDs, editor, markNodeMap]);

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];
    function onClick() {
      setScrollLock('Comments');
    }
    mapKeys.map(id => {
      const dataInfo = comments.find(comment => comment.id === id);
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.id = id;
            if (dataInfo && 'color' in dataInfo) elem.classList.add('mark-' + dataInfo.color);
            elem.onclick = onClick;
            changedElems.push(elem);
          }
        }
      }
    });
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i];
        changedElem.removeEventListener('click', onClick, false);
      }
    };
  }, [comments, editor, mapKeys, markNodeMap, setScrollLock]);

  useEffect(() => {
    const markNodeKeysToIDs: Map<NodeKey, Array<string>> = new Map();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from: MarkNode) => {
          return $createMarkNode(from.getIDs());
        },
        (from: MarkNode, to: MarkNode) => {
          // Merge the IDs
          const ids = from.getIDs();
          ids.forEach(id => {
            to.addID(id);
          });
        }
      ),
      editor.registerMutationListener(MarkNode, mutations => {
        editor.getEditorState().read(() => {
          for (const [key, mutation] of mutations) {
            const node: null | MarkNode = $getNodeByKey(key);
            let ids: NodeKey[] = [];

            if (mutation === 'destroyed') {
              ids = markNodeKeysToIDs.get(key) || [];
            } else if ($isMarkNode(node)) {
              ids = node.getIDs();
            }

            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              let markNodeKeys = markNodeMap.get(id);
              markNodeKeysToIDs.set(key, ids);

              if (mutation === 'destroyed') {
                if (markNodeKeys !== undefined) {
                  markNodeKeys.delete(key);
                  if (markNodeKeys.size === 0) {
                    markNodeMap.delete(id);
                  }
                }
              } else {
                if (markNodeKeys === undefined) {
                  markNodeKeys = new Set();
                  markNodeMap.set(id, markNodeKeys);
                }
                if (!markNodeKeys.has(key)) {
                  markNodeKeys.add(key);
                }
              }
            }
          }
        });
      }),
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            if ($isTextNode(anchorNode)) {
              const commentIDs = $getMarkIDs(anchorNode, selection.anchor.offset);
              if (commentIDs !== null) {
                setActiveIDs(commentIDs);
                hasActiveIds = true;
              }
              if (!selection.isCollapsed()) {
                setActiveAnchorKey(anchorNode.getKey());
                hasAnchorKey = true;
              }
            }
          } else if (!hasActiveIds) setActiveIDs(_activeIds => (_activeIds.length === 0 ? _activeIds : []));
          if (!hasAnchorKey) setActiveAnchorKey(null);
          if (!tags.has('collaboration') && $isRangeSelection(selection)) setShowCommentInput(false);
        });
      }),
      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = window.getSelection();
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          setShowCommentInput(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, markNodeMap]);

  const onAddComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  const cancelAddComment = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null)  selection.dirty = true;
    });
    setShowCommentInput(false);
  }, [editor]);

  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread,
      selection?: RangeSelection | null
    ) => {
      commentStore.addComment(namespace, commentOrThread, thread);
      if (isInlineComment) {
        editor.update(() => {
          if ($isRangeSelection(selection)) {
            const isBackward = selection.isBackward();
            const id = commentOrThread.id;

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id);
          }
        });
        setShowCommentInput(false);
        setScrollLock('Comments');
      }
    },
    [commentStore, editor, namespace, setScrollLock]
  );

  const deleteCommentOrThread = useCallback(
    (comment: Comment | Thread, thread?: Thread) => {
      if (comment.type === 'comment') {
        const deletionInfo = commentStore.deleteCommentOrThread(namespace, comment, thread);
        if (!deletionInfo) {
          return;
        }
        const { markedComment, index } = deletionInfo;
        commentStore.addComment(namespace, markedComment, thread, index);
      } else {
        commentStore.deleteCommentOrThread(namespace, comment);
        // Remove ids from associated marks
        const id = thread !== undefined ? thread.id : comment.id;
        const markNodeKeys = markNodeMap.get(id);
        if (markNodeKeys !== undefined) {
          // Do async to avoid causing a React infinite loop
          setTimeout(() => {
            editor.update(() => {
              for (const key of markNodeKeys) {
                const node: null | MarkNode = $getNodeByKey(key);
                if ($isMarkNode(node)) {
                  node.deleteID(id);
                  if (node.getIDs().length === 0) {
                    $unwrapMarkNode(node);
                  }
                }
              }
            });
          });
        }
      }
    },
    [commentStore, editor, markNodeMap, namespace]
  );

  const openCommentBox = init && activeAnchorKey !== null && activeAnchorKey !== undefined && !showCommentInput;

  const CreatePortalEl = useMemo(
    () =>
      ({ children, condition }: { children: JSX.Element; condition: boolean }) => {
        if (!condition) return null;
        return createPortal(children, document.body);
      },
    []
  );

  return (
    <div className="relative">
      <CreatePortalEl condition={init}>
        <CommentsPanel
          comments={comments}
          submitAddComment={submitAddComment}
          deleteCommentOrThread={deleteCommentOrThread}
          activeIDs={activeIDs}
          markNodeMap={markNodeMap}
          close={() => setScrollLock('Novel')}
          authorDetails={authorDetails}
          show={scrollLock === 'Comments'}
        />
      </CreatePortalEl>
      <CreatePortalEl condition={showCommentInput}>
        <CommentInputModal
          editor={editor}
          cancelAddComment={cancelAddComment}
          submitAddComment={submitAddComment}
          open={showCommentInput}
          authorDetails={authorDetails}
        />
      </CreatePortalEl>
      <CreatePortalEl condition={openCommentBox && init}>
        <AddCommentBox editor={editor} onAddComment={onAddComment} />
      </CreatePortalEl>
    </div>
  );
}
