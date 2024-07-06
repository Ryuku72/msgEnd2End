import { useRef, useState } from 'react';

import { CLEAR_EDITOR_COMMAND, EditorState, LexicalEditor } from 'lexical';

import { Comment, Thread, createComment, handleOnChange } from '../helpers/comments';
import { SendIcon } from '~/svg';
import BaseTextEditor from './BaseTextEditor';

export default function CommentsComposer({
  submitAddComment,
  thread,
  placeholder,
  authorDetails
}: {
  placeholder?: string;
  authorDetails: { name: string; color: string }
  submitAddComment: (
    commentOrThread: Comment,
    isInlineComment: boolean,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  thread?: Thread;
}) {
  const [content, setContent] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);

  const onChange = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    setContent(update.text);
    setCanSubmit(update.canSubmit);
  };

  const handleSubmit = (editor: LexicalEditor, userText: string) => {
    submitAddComment(createComment({ content: userText, author: authorDetails.name }), false, thread);
    if (editor !== null) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    }
  };

  const onClick = () => {
    if (canSubmit && editorRef.current) handleSubmit(editorRef.current, content);
  };

  const onSubmit = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    if (update.text && update.canSubmit) handleSubmit(_editor, update.text);
  };

  return (
    <div className="flex w-full gap-2 flex-auto p-2 pr-3 items-end">
        <BaseTextEditor
          onEscape={() => {
            return true;
          }}
          onChange={onChange}
          editorRef={editorRef}
          placeholder={placeholder}
          onSubmit={onSubmit}
        />
      <button
        type="button"
        className="w-access h-access flexCenter flex-col flex-shrink-0 disabled:bg-opacity-35 disabled:bg-gray-300 text-white bg-green-700 hover:bg-green-500 rounded-xl -translate-y-0.5"
        data-id="CommentPlugin_CommentsPanel_SendButton"
        onClick={onClick}
        disabled={!canSubmit}>
        <SendIcon className="w-[20px] h-auto translate-y-0.5 rotate-3" uniqueId="editor-send" svgColor="currentColor" />
      </button>
    </div>
  );
}
