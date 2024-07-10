import { useOutletContext, useSubmit } from '@remix-run/react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { CreateDate, CreateTimeOnly } from '~/helpers/DateHelper';
import { MessageWithUser } from '~/types';

import { DashOutletContext } from '~/routes/dash/route';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { TrashIcon, UpdateIcon } from '~/svg';

import { InitialConfig } from '../config';
import { UpdateEditorPlugin } from '../plugins/UpdateEditorPlugin';
import { useEffect, useRef } from 'react';

export default function MessageContainer({
  user_id,
  message,
  setUpdateMessage,
  namespace,
  show,
  index,
  last_seen_message_id
}: {
  user_id: string;
  message: MessageWithUser;
  setUpdateMessage: (state: { message_id: string; selection: string }) => void;
  namespace: string,
  show: boolean,
  index: number;
  last_seen_message_id: string;
}) {
  const { img_url } = useOutletContext<DashOutletContext>();
  const submit = useSubmit();
  // Messages from Sockets are not strings
  const messageContext = typeof message.message === 'string' ? JSON.parse(message.message) : message.message;
  const initialConfig = InitialConfig({ namespace: message.id, editable: false });

  const seenRef = useRef<HTMLDivElement | null>(null);

  const todaysDate = CreateDate(new Date().toISOString());
  const today = todaysDate === CreateDate(message.created_at);
  const created_at = today ? 'at ' + CreateTimeOnly(message.created_at) : 'on ' + CreateDate(message.created_at);

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

  useEffect(() => {
    const root = document.getElementById('scroll-container-chat');
    const options = {
      root,
      rootMargin: '0px',
      threshold: 1.0
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        const form = new FormData();
        form.append('last_seen_message_id', message.id);
        form.append('user_id', user_id);
        form.append('page_id', namespace);
        return submit(form, { method: 'POST', action: '/api/page/chat/user/last_seen_message_id', navigate: false });
      }
    };

    const observer = new IntersectionObserver(callback, options);
    if (root && seenRef.current && show && !index && last_seen_message_id !== message.id) observer.observe(seenRef.current);

    return () => {
      observer.disconnect();
    };
  }, [index, last_seen_message_id, message.id, namespace, show, submit, user_id]);

  return (
    <div className={`w-full flex gap-1 relative ${message.user.id === user_id ? 'justify-start' : 'justify-end'}`} data-index={index} ref={seenRef}>
      <div className={`rounded-xl flex flex-col gap-2 p-2 max-w-[calc(100%-4.5rem)] ${message.user.color}`}>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="flex flex-col flex-auto text-gray-600" id="lexical" />}
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <UpdateEditorPlugin editorStateJSONString={messageContext} />
        </LexicalComposer>
        <div className="flex gap-1">
          <img
            src={message.user.avatar ? img_url + message.user.avatar : Default_Avatar}
            onError={event => event.currentTarget.src = Default_Avatar}
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
          message.user.id === user_id && new Date(message.created_at) > getTimeThreeMinutesAgo()
            ? 'flex self-start gap-0.5'
            : 'hidden'
        }>
        <button
          className="w-access h-access text-blue-400 hover:text-blue-800 flexCenter"
          onClick={() => setUpdateMessage({ selection: JSON.stringify(messageContext), message_id: message.id })}>
          <UpdateIcon id="message-update" className="w-5 h-auto" />
        </button>
        <button
          type="button"
          onClick={() => handleDelete()}
          className="w-access h-access text-red-600 hover:text-red-800 flex justify-start items-center">
          <TrashIcon id="message-delete" className="w-4 h-auto" />
        </button>
      </div>
    </div>
  );
}
