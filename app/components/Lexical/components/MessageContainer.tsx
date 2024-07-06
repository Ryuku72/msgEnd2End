import { useOutletContext } from '@remix-run/react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { CreateDate, CreateTimeOnly } from '~/helpers/DateHelper';
import { MessageWithUser } from '~/types';

import { DashOutletContext } from '~/routes/dash/route';

import { InitialConfig } from '../config';

export default function MessageContainer({ user_id, message }: { user_id: string; message: MessageWithUser }) {
  const messageContext = typeof message.message === 'string' ? JSON.parse(message.message) : message.message;
  const initialConfig = InitialConfig({ namespace: message.id, editorState: messageContext, editable: false });
  const { img_url } = useOutletContext<DashOutletContext>();
  const todaysDate = CreateDate(new Date().toISOString());
  const today = todaysDate === CreateDate(message.created_at + 'Z');
  const created_at = today ? 'at ' + CreateTimeOnly(message.created_at) : 'on ' + CreateDate(message.created_at + 'Z');

  return (
    <div
      className={`rounded-xl flex flex-col gap-2 p-2 max-w-[90%] ${message.user.color} ${message.user.id === user_id ? 'self-start' : 'self-end'}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="flex flex-col flex-auto text-gray-600" id="lexical" />}
          placeholder={
            <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
      <div className="flex gap-1">
        <img src={img_url + message.user.avatar} alt="user profile" className="w-4 h-4 rounded-full translate-y-0.5" />
        <p className="text-sm text-gray-600 font-semibold">
          <span className="capitalize">{message.user.username}</span>{' '}
          <span className="text-xs text-gray-500 ">{created_at}</span>{' '}
        </p>
      </div>
    </div>
  );
}
