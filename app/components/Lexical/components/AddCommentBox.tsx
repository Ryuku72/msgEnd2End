import { useCallback, useEffect, useRef } from 'react';

import { mergeRegister } from '@lexical/utils';
import { $getSelection, COMMAND_PRIORITY_LOW, LexicalEditor, SELECTION_CHANGE_COMMAND } from 'lexical';

import { StickyIcon } from '~/svg';

export default function AddCommentBox({
  editor,
  onAddComment
}: {
  editor: LexicalEditor;
  onAddComment: () => void;
}): JSX.Element {
  const boxRef = useRef<HTMLButtonElement>(null);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = boxRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem);
    }
  }, [editor]);

  useEffect(() => {
    const scrollerElem = document.body.clientWidth < 768 ? window : document.getElementById('lexical');

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    const clear = () => {
      if (!boxRef.current) return;
      boxRef.current.style.opacity = '0';
      return;
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', clear);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', clear);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  function getDOMRangeRect(nativeSelection: Selection, rootElement: HTMLElement): DOMRect {
    const domRange = nativeSelection.getRangeAt(0);

    let rect;

    if (nativeSelection.anchorNode === rootElement) {
      let inner = rootElement;
      while (inner.firstElementChild !== null) {
        inner = inner.firstElementChild as HTMLElement;
      }
      rect = inner.getBoundingClientRect();
    } else {
      rect = domRange.getBoundingClientRect();
    }

    return rect;
  }

  function setFloatingElemPosition(targetRect: DOMRect | null, floatingElem: HTMLElement): void {
    const scrollerElem = document.getElementById(document.body.clientWidth < 768 ? 'dash-default' : 'lexical');
    if (targetRect === null || !scrollerElem) {
      floatingElem.style.opacity = '0';
      return;
    }

    const floatingElemRect = floatingElem.getBoundingClientRect();
    const editorScrollerRect = scrollerElem.getBoundingClientRect();

    const windowTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = targetRect.top - floatingElemRect.height + windowTop;
    let left = targetRect.left;

    if (left + floatingElemRect.width > editorScrollerRect.right) {
      left = editorScrollerRect.right - floatingElemRect.width;
    }

    floatingElem.style.opacity = '1';
    floatingElem.style.left = `${left + 15}px`;
    floatingElem.style.top = `${top - 15}px`;
  }

  return (
    <button
      type="button"
      data-id="CommentPlugin_AddCommentBox_button"
      data-string="Comment"
      className="h-button pl-0 pr-3 flexCenter absolute rounded-xl hover:bg-yellow-100 z-10 shadow-l font-semibold cursor-pointer bg-white text-gray-500 text-md after:content-[attr(data-string)]"
      onClick={onAddComment}
      ref={boxRef}>
      <StickyIcon svgColor="currentColor" uniqueId="lexical-comment" className="w-access h-auto p-2" />
    </button>
  );
}
