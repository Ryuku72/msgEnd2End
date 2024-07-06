import { useCallback, useEffect, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  SELECTION_CHANGE_COMMAND
} from 'lexical';

import {
  TypeBoldIcon,
  TypeItalicIcon,
  TypeStrikeThroughIcon,
  TypeUnderlineIcon
} from '~/svg';

import { HighPriory, LowPriority } from '../helpers';

export default function FloatingChatToolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const boxRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e: LexicalNode) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        HighPriory
      )
    );
  }, [editor, $updateToolbar]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = boxRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) return;

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
    } else {
      popupCharStylesEditorElem.style.opacity = '0';
    }
  }, [editor]);

  useEffect(() => {
    const scrollerElem = document.getElementById('lexical-chat');

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
    const scrollerElem = document.getElementById('lexical-chat');
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
    <div ref={boxRef} className="absolute z-50 flex gap-1 bg-white text-gray-500 shadow-lg py-1 px-3 rounded-2xl">
      <button
        type="button"
        title="Format Bold"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (isBold ? 'border bg-gray-200 hover:bg-gray-300 text-gray-600' : 'text-gray-500 hover:bg-gray-100')
        }
        aria-label="Format Bold">
        <TypeBoldIcon uniqueId="lexical-bold" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Format Italics"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (isItalic ? 'border bg-gray-200 hover:bg-gray-300 text-gray-600' : 'text-gray-500 hover:bg-gray-100')
        }
        aria-label="Format Italics">
        <TypeItalicIcon uniqueId="lexical-italic" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Format Underline"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (isUnderline ? 'border bg-gray-200 hover:bg-gray-300 text-gray-600' : 'text-gray-500 hover:bg-gray-100')
        }
        aria-label="Format Underline">
        <TypeUnderlineIcon uniqueId="lexical-underline" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Format Strikethrough"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (isStrikethrough ? 'border bg-gray-200 hover:bg-gray-300 text-gray-600' : 'text-gray-500 hover:bg-gray-100')
        }
        aria-label="Format Strikethrough">
        <TypeStrikeThroughIcon uniqueId="lexical-strikethrough" className="w-5 h-auto" />
      </button>
    </div>
  );
}
