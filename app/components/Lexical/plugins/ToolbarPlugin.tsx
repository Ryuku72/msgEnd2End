import { useOutletContext } from '@remix-run/react';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';

import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  CommentsIcon,
  CheckListIcon,
  HorizontalRuleIcon,
  JustifyIcon,
  ListOLIcon,
  ListULIcon,
  MicIcon,
  QuoteIcon,
  TextCenterIcon,
  TextH1Icon,
  TextH2Icon,
  TextH3Icon,
  TextLeftIcon,
  TextParagraphIcon,
  TextRightIcon,
  TypeBoldIcon,
  TypeItalicIcon,
  TypeStrikeThroughIcon,
  TypeUnderlineIcon
} from '~/svg';

import { SPEECH_TO_TEXT_COMMAND } from './SpeechToTextPlugin';
import { blockTypeToBlockName, HighPriory, LowPriority } from '../helpers';
import { DashOutletContext } from '~/routes/dash/route';

export function Divider() {
  return <div className="w-[1px] bg-gray-300 mx-2" />;
}

export type ToolbarPluginProps = {
  handleConnectionToggle: () => void;
  status: string;
  enableCollab: boolean;
  owner: boolean;
};

export default function ToolbarPlugin() {
  const { scrollLock, setScrollLock } = useOutletContext<DashOutletContext>();
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [enableSpeech, setEnableSpeech] = useState(false);
  const toolbarRef = useRef(null);

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

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName);
        }
      }
    }
  }, []);

  useEffect(() => {
    const SUPPORT_SPEECH_RECOGNITION: boolean = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setEnableSpeech(SUPPORT_SPEECH_RECOGNITION);
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
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        FORMAT_ELEMENT_COMMAND,
        payload => {
          setElementFormat(payload);
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

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    } else {
      formatParagraph();
    }
  };

  return (
    <div className="flex mb-[1px] bg-white py-2 px-1 rounded-t-md flex-wrap gap-1 sticky top-0 z-10" ref={toolbarRef}>
      <button
        type="button"
        title="Undo"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex rounded cursor-pointer w-access h-access items-center justify-center text-gray-500 disabled:text-gray-300"
        aria-label="Undo">
        <ArrowCounterClockwiseIcon uniqueId="lexical-undo" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Redo"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="flex rounded cursor-pointer w-access h-access items-center justify-center text-gray-500 disabled:text-gray-300"
        aria-label="Redo">
        <ArrowClockwiseIcon uniqueId="lexical-redo" className="w-5 h-auto" />
      </button>
      <Divider />
      <button
        type="button"
        title="Format Heading size 1"
        onClick={() => formatHeading('h1')}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'h1' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Format Heading size 1">
        <TextH1Icon uniqueId="lexical-bold" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Format Heading size 2"
        onClick={() => formatHeading('h2')}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'h2' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Format Heading size 2">
        <TextH2Icon uniqueId="lexical-bold" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Format Heading size 3"
        onClick={() => formatHeading('h3')}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'h3' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Format Heading size 3">
        <TextH3Icon uniqueId="lexical-bold" className="w-5 h-auto" />
      </button>
      <Divider />
      <button
        type="button"
        title="Format Bold"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (isBold ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
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
          (isItalic ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
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
          (isUnderline ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
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
          (isStrikethrough ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Format Strikethrough">
        <TypeStrikeThroughIcon uniqueId="lexical-strikethrough" className="w-5 h-auto" />
      </button>
      <Divider />
      <button
        type="button"
        title="Format Paragraph"
        onClick={formatParagraph}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'paragraph' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Format Paragraph">
        <TextParagraphIcon uniqueId="lexical-paragraph" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Order List Align"
        onClick={formatNumberedList}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'number' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Order List Align">
        <ListOLIcon uniqueId="lexical-justify" className="w-5 h-auto text-gray-500" />
      </button>
      <button
        type="button"
        title="Unorder List Align"
        onClick={formatBulletList}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'bullet' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Unorder List Align">
        <ListULIcon uniqueId="lexical-justify" className="w-5 h-auto text-gray-500" />
      </button>
      <button
        type="button"
        title="Checklist"
        onClick={formatCheckList}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'check' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Checklist">
        <CheckListIcon uniqueId="lexical-justify" className="w-5 h-auto text-gray-500" />
      </button>
      <button
        type="button"
        title="Quote Align"
        onClick={formatQuote}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (blockType === 'quote' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Quote Align">
        <QuoteIcon uniqueId="lexical-justify" className="w-5 h-auto text-gray-500" />
      </button>
      <Divider />
      <button
        type="button"
        title="Left Align"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (elementFormat === 'left' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Left Align">
        <TextLeftIcon uniqueId="lexical-left-align" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Center Align"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (elementFormat === 'center' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Center Align">
        <TextCenterIcon uniqueId="lexical-center-align" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Right Align"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (elementFormat === 'right' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Right Align">
        <TextRightIcon uniqueId="lexical-right-align" className="w-5 h-auto" />
      </button>
      <button
        type="button"
        title="Justify Align"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={
          'flex rounded cursor-pointer w-access h-access items-center justify-center ' +
          (elementFormat === 'justify' ? 'border bg-gray-200 text-gray-600' : 'text-gray-500')
        }
        aria-label="Justify Align">
        <JustifyIcon uniqueId="lexical-justify" className="w-5 h-auto text-gray-500" />
      </button>
      <Divider />
      <button
        type="button"
        title="Horizontal Rule Insert"
        onClick={() => {
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        }}
        className="flex rounded cursor-pointer w-access h-access items-center justify-center text-gray-500"
        aria-label="Horizonital Rule Insert">
        <HorizontalRuleIcon uniqueId="lexical-justify" className="w-5 h-auto" />
      </button>
      {enableSpeech && (
        <Fragment>
          <Divider />
          <button
            type="button"
            onClick={() => {
              editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
              setIsSpeechToText(!isSpeechToText);
            }}
            className={
              !enableSpeech
                ? 'hidden'
                : 'flex flex-col rounded cursor-pointer w-access h-access items-center justify-center ' +
                  (isSpeechToText ? 'bg-orange-300 text-white' : 'text-gray-500')
            }
            title="Speech To Text"
            aria-label={`${isSpeechToText ? 'Enable' : 'Disable'} speech to text`}>
            <MicIcon uniqueId="lexical-mic" className="w-5 h-auto" />
          </button>
        </Fragment>
      )}
      <Divider />
      <button
        type="button"
        className={`flex gap-3 rounded cursor-pointer w-access h-access items-center justify-center px-2 bg-opacity-75 backdrop-blur-sm ${scrollLock === 'Comments' ? 'bg-pink-400 text-white' : 'bg-white text-gray-500'}`}
        data-id="CommentPlugin_ShowCommentsButton"
        onClick={() => setScrollLock(scrollLock === 'Comments' ? 'Novel' : 'Comments')}
        title={scrollLock === 'Comments' ? 'Hide Comments' : 'Show Comments'}>
        <CommentsIcon uniqueId="commentPlugin-icon" className="w-5 h-auto -scale-x-100" />
      </button>
    </div>
  );
}
