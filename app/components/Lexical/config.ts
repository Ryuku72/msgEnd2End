import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { InitialConfigType, InitialEditorStateType } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorThemeClasses } from 'lexical';
import { LinkNode } from '@lexical/link';

export const theme: EditorThemeClasses = {
  // Theme styling goes here
  ltr: 'text-left',
  rtl: 'text-right',
  placeholder: 'text-gray-400',
  paragraph: 'em:text-base',
  quote: 'editor-quote',
  blockCursor: 'editor-blockCursor',
  heading: {
    h1: 'em:text-6xl',
    h2: 'em:text-4xl',
    h3: 'em:text-2xl'
  },
  hr: 'editor-hr',
  list: {
    nested: {
      listitem: 'editor-nested-listitem'
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    checklist: 'editor-checklist',
    listitem: 'editor-listitem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked'
  },
  link: 'editor-link',
  mark: 'editor-mark',
  text: {
    bold: 'text-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline_line-through',
    code: 'editor-text-code'
  }
};

function onError(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}
export function InitialConfig(props: { namespace: string; editorState?: InitialEditorStateType; editable?: boolean }): InitialConfigType {
  const { namespace, editorState = null, editable = false } = props;
  return {
    theme,
    onError,
    editorState: editorState ? JSON.stringify(editorState) : null,
    editable,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, OverflowNode, HorizontalRuleNode, MarkNode, LinkNode],
    namespace
  };
}
