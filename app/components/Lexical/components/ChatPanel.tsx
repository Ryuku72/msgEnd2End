import { Form, useSubmit } from '@remix-run/react';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { CLEAR_EDITOR_COMMAND, EditorState, LexicalEditor } from 'lexical';

import { MessageWithUser } from '~/types';

import { ExpandIcon, SendIcon, ShrinkIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';

import { InitialConfig } from '../config';
import { KeySubmitPlugin } from '../plugins/KeySubmitPlug';
import OnChangePlugin from '../plugins/OnChangePlugin';
import { UpdateEditorPlugin } from '../plugins/UpdateEditorPlugin';
import FloatingChatToolbar from './FloatingChatToolbar';
import MessageContainer from './MessageContainer';

export default function ChatPanel({
  close,
  show,
  messages,
  namespace,
  user_id,
  setLastSeen
}: {
  messages: MessageWithUser[];
  namespace: string;
  user_id: string;
  setLastSeen: (date: string) => void;
  close: () => void;
  show: boolean;
}): JSX.Element {
  const [fullScreenComments, setFullScreenComments] = useState(false);
  const [editorState, setEditorState] = useState('');
  const [init, setInit] = useState(false);
  const [update, setUpdate] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);
  const seenRef = useRef<HTMLDivElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const updateMessage = useRef({ message_id: '', selection: '' });

  const initialConfig = InitialConfig({ namespace, editable: true });
  const submit = useSubmit();

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    const options = {
      root: scrollContainer.current,
      rootMargin: '0px',
      threshold: 1.0
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && show) setLastSeen(new Date().toISOString());
    };

    const observer = new IntersectionObserver(callback, options);
    if (scrollContainer.current && seenRef.current) observer.observe(seenRef.current);

    return () => {
      observer.disconnect();
    };
  }, [setLastSeen, show]);

  const CreatePortalEl = useMemo(
    () =>
      ({ children, condition }: { children: JSX.Element; condition: boolean }) => {
        if (!condition) return null;
        return createPortal(children, document.body);
      },
    []
  );

  const handleUpdateRequest = (state: { message_id: string; selection: string }) => {
    updateMessage.current = state;
    setUpdate(true);
  };

  const onSubmit = (_editorState: string) => {
    const formData = new FormData();
    if (!_editorState) return;
    formData.append('message', _editorState);
    formData.append('page_id', namespace);
    formData.append('user_id', user_id);
    submit(formData, { method: 'POST', action: '/api/page/chat/insert', navigate: false });
    if (editorRef.current) editorRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  };

  const onUpdate = (_editorState: string, message_id: string) => {
    const formData = new FormData();
    if (!_editorState) return;
    formData.append('message', _editorState);
    formData.append('page_id', namespace);
    formData.append('user_id', user_id);
    formData.append('message_id', message_id);
    submit(formData, { method: 'POST', action: '/api/page/chat/update', navigate: false });
    if (editorRef.current) editorRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    updateMessage.current = { message_id: '', selection: '' };
    setUpdate(false);
  };

  return (
    <div
      data-id="ChatPanel"
      className={`fixed flex flex-col flex-auto gap-1 right-0 z-40 transition-all ease-out duration-500 ${fullScreenComments ? 'md:pl-[85px] w-full h-full top-0' : 'md:w-[400px] w-full md:h-[calc(100%_-_80px)] h-full md:top-10 top-0'} ${show ? 'translate-x-0' : 'md:translate-x-[400px] translate-x-[767px]'}`}>
      <div className="w-full flex flex-col flex-auto gap-1 overflow-hidden rounded-l-md bg-white bg-opacity-50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,_0,_0,_0.1)] ">
        <div className="w-full flex-shrink-0 pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center bg-white bg-opacity-80 backdrop-blur-sm">
          <div className="flex gap-3 items-center">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
              &#8197;Chat&nbsp;&nbsp;&nbsp;
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="w-10 h-10 md:flexCenter hidden text-slate-500 hover:text-blue-400 group"
              onClick={() => setFullScreenComments(!fullScreenComments)}>
              {fullScreenComments ? (
                <ShrinkIcon
                  className="w-5 h-5 scale-125 group-hover:scale-90 transition-transform"
                  uniqueId="shrink-comments-icon"
                  svgColor="currentColor"
                />
              ) : (
                <ExpandIcon
                  className="w-5 h-5 group-hover:scale-150 transition-transform"
                  uniqueId="expand-comments-icon"
                  svgColor="currentColor"
                />
              )}
            </button>
            <button className="crossButton" type="button" onClick={close}>
              <CloseIcon className="w-3 h-3" uniqueId="close-comments-icon" svgColor="currentColor" />
            </button>
          </div>
        </div>
        <div
          className="flex flex-col-reverse flex-auto w-full py-1 px-2 gap-1 overflow-auto items-end"
          ref={scrollContainer}>
          <div className="w-full flex flex-col flex-auto" ref={seenRef} />
          {messages.map(message => (
            <MessageContainer
              key={message.id}
              user_id={user_id}
              message={message}
              setUpdateMessage={handleUpdateRequest}
            />
          ))}
        </div>
        <p className="text-xs italic text-gray-400 p-2 bg-yellow-100">Highlight Text To Show Text Options</p>
        <Form
          className="w-full bg-white bg-opacity-65 backdrop-blur-sm"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            if (update) onUpdate(editorState, updateMessage.current.message_id);
            else onSubmit(editorState);
          }}>
          <fieldset className="w-full flex items-end gap-1 relative p-0.5 pr-1">
            <LexicalComposer initialConfig={initialConfig}>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="flex flex-col flex-auto min-h-[50px] max-h-[200px] overflow-auto pt-2.5 pb-3 px-2 text-gray-600 justify-end"
                    id="lexical-chat"
                  />
                }
                placeholder={
                  <div className="absolute top-4 z-0 px-2 pointer-events-none text-gray-400">Enter some text...</div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <KeySubmitPlugin
                onSubmit={(editorState: EditorState) => {
                  const editorString = JSON.stringify(editorState.toJSON());
                  if (updateMessage.current.message_id) onUpdate( editorString, updateMessage.current.message_id);
                  else onSubmit(editorString);
                }}
              />
              <ClearEditorPlugin />
              <UpdateEditorPlugin editorStateJSONString={updateMessage.current.selection} />
              <OnChangePlugin onChange={setEditorState} />
              <EditorRefPlugin editorRef={editorRef} />
              <CreatePortalEl condition={init}>
                <FloatingChatToolbar />
              </CreatePortalEl>
            </LexicalComposer>
            <button
              className="w-access h-access flexCenter flex-col flex-shrink-0 disabled:bg-opacity-35 disabled:bg-gray-300 text-white bg-green-700 hover:bg-green-500 rounded-xl -translate-y-1"
              data-id="CommentPlugin_CommentsPanel_SendButton">
              <SendIcon
                className="w-[20px] h-auto translate-y-0.5 rotate-3"
                uniqueId="editor-send"
                svgColor="currentColor"
              />
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
