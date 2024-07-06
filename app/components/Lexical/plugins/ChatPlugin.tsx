import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { SupabaseClient } from '@supabase/supabase-js';

import { Message, MessageWithUser, SupabaseBroadcast } from '~/types';

import ChatPanel from '../components/ChatPanel';

type ChatBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Message; old: Message };

export default function ChatPlugin({
  supabase,
  chat,
  openChat,
  close,
  namespace,
  user_id,
  setShowChatNotif
}: {
  supabase: SupabaseClient;
  chat: MessageWithUser[];
  openChat: boolean;
  close: () => void;
  setShowChatNotif: (state:boolean) => void;
  namespace: string;
  user_id: string;
}) {
  const [messages, setMessages] = useState<MessageWithUser[]>(chat);
  const [lastSeenMessage, setLastSeenMessage] = useState(chat[0]?.created_at + 'Z');
  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (openChat) {
      setShowChatNotif(false);
      return setLastSeenMessage(messages[0]?.created_at + 'Z');
    } else if (!messages || !lastSeenMessage) return;
    const lastClientMessage = new Date(messages[0]?.created_at + 'Z');
    if (new Date(lastSeenMessage) < lastClientMessage) setShowChatNotif(true);
    else setShowChatNotif(false);
  }, [setShowChatNotif, lastSeenMessage, messages, openChat]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `page_id=eq.${namespace}`
        },
        async payload => {
          const info = payload as unknown as ChatBroadcast;
          switch (payload.eventType) {
            case 'INSERT': {
              const insert = await supabase
                .from('chats')
                .select('*, user:profiles!user_id(color, username, avatar, id)')
                .match({ id: payload.new.id })
                .single();
              if (insert.error) return;
              return setMessages(message => [insert.data as unknown as MessageWithUser, ...message]);
            }
            case 'UPDATE':
              return setMessages(messages => {
                return messages.map(message => {
                  if (message.id === info.new.id) return { ...info.new, user: message.user };
                  return message;
                });
              });
            case 'DELETE':
              return setMessages(messages => messages.filter(message => message.id !== info.old.id));
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [namespace, supabase]);

  const CreatePortalEl = useMemo(
    () =>
      ({ children, condition }: { children: JSX.Element; condition: boolean }) => {
        if (!condition) return null;
        return createPortal(children, document.body);
      },
    []
  );

  return (
    <div className="relative">
      <CreatePortalEl condition={init}>
        <ChatPanel messages={messages} show={openChat} close={close} user_id={user_id} namespace={namespace} setLastSeen={setLastSeenMessage} />
      </CreatePortalEl>
    </div>
  );
}
