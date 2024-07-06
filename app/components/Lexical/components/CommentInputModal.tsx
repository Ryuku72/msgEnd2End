import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { $getSelection, $isRangeSelection, EditorState, LexicalEditor, RangeSelection } from 'lexical';

import { userColor } from '~/helpers/UserColor';

import { Comment, Thread, createComment, createThread, handleOnChange } from '../helpers/comments';
import BaseTextEditor from './BaseTextEditor';
import { ArrowIcon, StickyIcon } from '~/svg';

export default function CommentInputModal({
  editor,
  cancelAddComment,
  submitAddComment,
  open,
  authorDetails
}: {
  cancelAddComment: () => void;
  editor: LexicalEditor;
  open: boolean;
  authorDetails: { name: string; color: string };
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: RangeSelection | null
  ) => void;
}) {
  const [content, setContent] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const commentBoxRef = useRef<HTMLDivElement>(null);
  const highlightBoxRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<RangeSelection | null>(null);
  const selectionState = useMemo(() => ({ elements: [] }), []);

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        selectionRef.current = selection.clone();
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(editor, anchor.getNode(), anchor.offset, focus.getNode(), focus.offset);
        const boxElem = commentBoxRef.current;
        if (range !== null && boxElem !== null) {
          // code here is for the comment box location
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft = selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20 + (window.pageYOffset || document.documentElement.scrollTop)}px`;

          // code below is for the hightlighted text
          const selectionRectsLength = selectionRects.length;
          const container = highlightBoxRef.current;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;
          if (!container) return;
          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement('span');
              elements[i] = elem;
              container.appendChild(elem);
            }
            const top = selectionRect.top + (window.pageYOffset || document.documentElement.scrollTop);

            elem.style.position = 'absolute';
            elem.style.zIndex = '10';
            elem.style.pointerEvents = 'none';
            elem.style.top = `${top}px`;
            elem.style.left = `${selectionRect.left}px`;
            elem.style.height = `${selectionRect.height}px`;
            elem.style.width = `${selectionRect.width}px`;
            elem.style.backgroundColor = userColor(authorDetails.color, 0.3);
          }
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem);
            elements.pop();
          }
        }
      }
    });
  }, [authorDetails.color, editor, selectionState.elements]);

  useEffect(() => {
    updateLocation();
    const container = highlightBoxRef.current;
    const body = document.body;
    if (body !== null && container) {
      container.style.display = 'flex';
      return () => {
        container.style.display = 'none';
      };
    }
  }, [updateLocation, open]);

  useEffect(() => {
    window.addEventListener('resize', updateLocation);

    return () => {
      window.removeEventListener('resize', updateLocation);
    };
  }, [updateLocation]);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    setContent('');
    cancelAddComment();
    return true;
  };

  const submitComment = (userText: string) => {
    let quote = editor.getEditorState().read(() => {
      const selection = selectionRef.current;
      return selection ? selection.getTextContent() : '';
    });
    if (quote.length > 100) {
      quote = quote.slice(0, 99) + '…';
    }
    submitAddComment(
      createThread({
        quote,
        comments: [createComment({ content: userText, author: authorDetails.name })],
        id: undefined,
        color: authorDetails.color
  }),
      true,
      undefined,
      selectionRef.current
    );
    selectionRef.current = null;
  };

  const onClick = () => {
    if (canSubmit && editor) submitComment(content);
  };

  const onChange = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    setContent(update.text);
    setCanSubmit(update.canSubmit);
  };

  const onSubmit = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    if (update.text && update.canSubmit) submitComment(update.text);
  };

  return (
    <Fragment>
      <div
        data-id="CommentPlugin_CommentInputBox"
        className="absolute before:absolute w-[300px] bg-white shadow-[0_0_5px_rgba(0,_0,_0,_0.05)] rounded z-20 tooltip-spike-t [&>:first-child]:min-h-[100px] flex flex-col p-1 pt-3"
        ref={commentBoxRef}>
        <BaseTextEditor onEscape={onEscape} onChange={onChange} closed={!open} onSubmit={onSubmit} />
        <p className="p-2 text-xs italic text-gray-400">
          Submit: <kbd>Ctrl</kbd> or <kbd>Window</kbd> + <kbd>Enter</kbd>
        </p>
        <div className="flex p-2 pt-0.5 gap-3">
          <button
            type="button"
            onClick={cancelAddComment}
            data-id="CommentPlugin_CommentInputBox_Button"
            data-string="Cancel"
            className="cancelButton w-button !h-[35px] font-normal rounded after:content-[attr(data-string)]">
            <ArrowIcon uniqueId="lexical-comment-cancel-icon" className="w-5 h-auto rotate-180" />
          </button>
          <button
            type="button"
            onClick={onClick}
            disabled={!canSubmit}
            data-string="Comment"
            className="confirmButton w-button !h-[35px] disabled:bg-gray-100 disabled:text-gray-300 font-normal rounded after:content-[attr(data-string)]"
            data-id="CommentPlugin_CommentInputBox_Button">
            <StickyIcon svgColor="currentColor" uniqueId="lexical-comment-input-icon" className="w-5 h-auto" /> 
          </button>
        </div>
      </div>
      <div ref={highlightBoxRef} />
    </Fragment>
  );
}
