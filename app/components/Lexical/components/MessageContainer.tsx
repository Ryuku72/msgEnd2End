import { useOutletContext, useSubmit } from '@remix-run/react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { CreateDate, CreateTimeOnly } from '~/helpers/DateHelper';
import { MessageWithUser } from '~/types';

import { DashOutletContext } from '~/routes/dash/route';

import { TrashIcon, UpdateIcon } from '~/svg';

import { InitialConfig } from '../config';
import { UpdateEditorPlugin } from '../plugins/UpdateEditorPlugin';

export default function MessageContainer({ user_id, message, setUpdateMessage }: { user_id: string; message: MessageWithUser; setUpdateMessage: (state: { message_id: string; selection: string }) => void }) {
  const { img_url } = useOutletContext<DashOutletContext>();
  const submit = useSubmit();
  // Messages from Sockets are not strings
  const messageContext = typeof message.message === 'string' ? JSON.parse(message.message) : message.message;
  const initialConfig = InitialConfig({ namespace: message.id, editable: false });

  const todaysDate = CreateDate(new Date().toISOString());
  const today = todaysDate === CreateDate(message.created_at + 'Z');
  const created_at = today ? 'at ' + CreateTimeOnly(message.created_at) : 'on ' + CreateDate(message.created_at + 'Z');

  const getTimeThreeMinutesAgo = () => {
    const now = new Date();
    const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000); // Subtract 3 minutes (3 minutes * 60 seconds * 1000 milliseconds)
    return threeMinutesAgo;
  };

  const handleDelete = () => {
    const data = new FormData();
    data.append('message_id', message.id);
    submit(data, { method: 'DELETE', action: '/api/page/chat/delete', navigate: false });
  };

  return (
    <div className={`w-full flex gap-1 ${message.user.id === user_id ? 'justify-start' : 'justify-end'}`}>
      <div className={`rounded-xl flex flex-col gap-2 p-2 max-w-[calc(100%-4.5rem)] ${message.user.color}`}>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="flex flex-col flex-auto text-gray-600" id="lexical" />}
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <UpdateEditorPlugin editorStateJSONString={messageContext}  />
        </LexicalComposer>
        <div className="flex gap-1">
          <img
            src={img_url + message.user.avatar}
            alt="user profile"
            className="w-4 h-4 rounded-full translate-y-0.5"
          />
          <p className="text-sm text-gray-600 font-semibold">
            <span className="capitalize">{message.user.username}</span>{' '}
            <span className="text-xs text-gray-500 ">{created_at}</span>{' '}
          </p>
        </div>
      </div>
      <div
        className={
          message.user.id === user_id && new Date(message.created_at + 'Z') > getTimeThreeMinutesAgo()
            ? 'flex self-start gap-0.5'
            : 'hidden'
        }>
        <button className="w-access h-access text-blue-400 hover:text-blue-800 flexCenter" onClick={() => setUpdateMessage({ selection: JSON.stringify(messageContext), message_id: message.id })}>
          <UpdateIcon uniqueId="message-update" className="w-5 h-auto" />
        </button>
        <button type="button" onClick={() => handleDelete()} className="w-access h-access text-red-600 hover:text-red-800 flex justify-start items-center">
          <TrashIcon uniqueId="message-delete" className="w-4 h-auto" />
        </button>
      </div>
    </div>
  );
}
