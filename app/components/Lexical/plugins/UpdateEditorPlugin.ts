import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function UpdateEditorPlugin({ editorStateJSONString }: { editorStateJSONString: string }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editorStateJSONString) return;
    return editor.update(() => {
        const editorState = editor.parseEditorState(editorStateJSONString);
        editor.setEditorState(editorState);
    });
  }, [editor, editorStateJSONString]);

  return null;
}
