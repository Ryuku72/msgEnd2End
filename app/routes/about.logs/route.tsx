import { Link, useLoaderData, useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { InitialConfig } from '~/components/Lexical/config';
import { PublicLayout } from '~/components/PublicLayout';

import { MarkdownParserPlugin } from './components/MarkdownParserPlugin';
import { ArrowIcon } from '~/svg';
import * as fs from 'fs';
import path from 'path';

export async function loader() {
  const filePath = path.resolve(process.cwd(), './app/routes/about.logs/review.md');
  const readFile = await fs.readFileSync(filePath, 'utf8');
  const markdown = readFile;
  return { markdown };
}

export default function Logs() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const { markdown } = useLoaderData() as { markdown: string };

  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 6
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const initialConfig = InitialConfig({
    namespace: 'changeLog',
    editable: false,
    editorState: () => $convertFromMarkdownString(markdown, TRANSFORMERS)
  });

  return (
    <PublicLayout>
      <div className="flex justify-center items-center gap-10 flex-col w-full max-w-[1250px] flex-auto">
        <h1 className="text-red-700 text-6xl font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          Change Logs
        </h1>
        <div className="w-full flex text-lg bg-black bg-opacity-50 backdrop-blur-sm rounded-lg">
          <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="flex flex-col flex-auto py-8 px-4 text-white" id="lexical" />
              }
              placeholder={
                <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownParserPlugin md={markdown} />
          </LexicalComposer>
        </div>
        <Link
          to="/about"
          className="cancelButton sticky bottom-6 after:content-[attr(data-string)] w-button"
          data-string="Back">
          <ArrowIcon id="about-back" className="w-6 h-auto rotate-180" />
        </Link>
      </div>
    </PublicLayout>
  );
}
