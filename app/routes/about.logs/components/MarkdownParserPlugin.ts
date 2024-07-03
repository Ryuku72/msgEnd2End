import { useEffect } from 'react';

import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function MarkdownParserPlugin({ md }: { md: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(md, TRANSFORMERS);
    });
  }, [md, editor]);

  return null;
}
