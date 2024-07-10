/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext, useSubmit } from '@remix-run/react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Provider } from '@lexical/yjs';
import { useOthers, useRoom, useStatus } from '@liveblocks/react';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { Doc } from 'yjs';

import { userColor } from '~/helpers/UserColor';
import { BasicProfile, MessageWithUser } from '~/types';

import { InitialConfig } from '~/components/Lexical/config';
import { initialEditorState } from '~/components/Lexical/helpers';
import ChatPlugin from '~/components/Lexical/plugins/ChatPlugin';
import CommentPlugin from '~/components/Lexical/plugins/CommentPlugin';
import { MaxLengthPlugin } from '~/components/Lexical/plugins/MaxLengthPlugin';
import OnChangePlugin from '~/components/Lexical/plugins/OnChangePlugin';
import SpeechToTextPlugin from '~/components/Lexical/plugins/SpeechToTextPlugin';
import ToggleEditState from '~/components/Lexical/plugins/ToggleEditState';
import ToolbarPlugin from '~/components/Lexical/plugins/ToolbarPlugin';
import { DashOutletContext } from '~/routes/dash/route';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { ChatIcon, CollabIcon, ConnectIcon, DisconnectIcon, HelpIcon, SoloIcon, SyncIcon } from '~/svg';

import { CornerAlert } from './CornerAlert';
import TutorialModal from './TutorialModal';

export type ActiveUserProfile = Omit<BasicProfile, 'id'> & { userId: string };

export function PageRichTextEditor({
  namespace,
  userData,
  enableCollab,
  ownerId,
  ownerInfo,
  supabase,
  chat,
  last_seen_message_id
}: {
  namespace: string;
  enableCollab: boolean;
  userData: ActiveUserProfile;
  ownerId: string;
  ownerInfo: BasicProfile;
  supabase: SupabaseClient;
  chat: MessageWithUser[];
  last_seen_message_id: string;
}) {
  const owner = userData.userId === ownerId;
  const { scrollLock, setScrollLock } = useOutletContext<DashOutletContext>();

  const initialConfig = InitialConfig({ namespace, editable: enableCollab || owner });
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [init, setInit] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showChatNotif, setShowChatNotif] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const submit = useSubmit();

  const room = useRoom();
  const status = useStatus();
  const userInfo: Liveblocks['UserMeta']['info'] = {
    avatar: userData.avatar || '',
    color: userColor(userData.color),
    name: userData.username,
    userId: userData.userId
  };
  const othersInfo = useOthers();
  const otherusers = othersInfo?.map(user => user.info);
  const users = [userInfo].concat(otherusers);
  const ownerIsPresent = users.some(user => user.userId === ownerId);
  const maxLength = 8500;

  useEffect(() => {
    setInit(true);
  }, []);

  const createProviderFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Doc>): Provider => {
      const doc = new Doc();
      yjsDocMap.set(id, doc);
      const yProvider = new LiveblocksYjsProvider(room, doc) as Provider;
      yProvider.on('sync', status => setIsSynced(status));
      return yProvider;
    },
    [room]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px]">
        <p className="w-full text-sm font-medium text-gray-600 mb-2">Participants</p>
        <div className="flex gap-2 text-blue-800 items-center text-sm mb-3 max-w-[80%]">
          {users.map((user, index) => (
            <div
              key={user.name + '_' + index}
              className="text-grey-700 text-sm px-2 py-1 rounded-lg flex gap-1 flex-wrap items-center text-gray-700"
              style={{ backgroundColor: user.color }}>
              <img
                src={user?.avatar || Default_Avatar}
                className="rounded-full w-4 h-4"
                alt="user-avatar"
                onError={e => {
                  e.currentTarget.src = Default_Avatar;
                  e.currentTarget.onerror = null;
                  return e;
                }}
              />
              {user.name}
            </div>
          ))}
        </div>
        <label htmlFor="lexical" className="w-full text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <ToolbarPlugin />
        <div className="bg-white bg-opacity-65 flex flex-col flex-auto rounded-b-md relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="flex flex-col flex-auto py-2 px-4 text-gray-600" id="lexical" />
            }
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={setEditorState} />
          {/* Only using init because Collabration Plugin references document */}
          {init && (
            <CollaborationPlugin
              id={namespace + '_room'}
              providerFactory={createProviderFactory}
              cursorColor={userInfo?.color}
              username={userInfo?.name}
              cursorsContainerRef={containerRef}
              initialEditorState={initialEditorState}
              shouldBootstrap={true}
            />
          )}
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <SpeechToTextPlugin />
          <ClearEditorPlugin />
          <ToggleEditState enable_edit={enableCollab || owner} />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
          <CommentPlugin namespace={namespace} userData={userData} providerFactory={createProviderFactory} />
          <ChatPlugin
            supabase={supabase}
            chat={chat}
            openChat={scrollLock === 'Chat'}
            close={() => setScrollLock('Novel')}
            namespace={namespace}
            user_id={userData.userId}
            setShowChatNotif={setShowChatNotif}
            last_seen_message_id={last_seen_message_id}
          />
          <div className="sticky md:bottom-3 bottom-[90px] right-4 self-end m-2 flex gap-2">
            <p
              className={`bg-orange-500 bg-opacity-25 backdrop-blur-sm px-2 flex items-center h-access rounded text-xs self-end cursor-default ${textLength < maxLength ? 'text-blue-800' : 'text-red-400'}`}>
              {textLength} / {maxLength} length
            </p>
            <button
              type="button"
              disabled={!owner}
              title={`Owner has ${enableCollab ? 'enabled collabaration' : 'disabled collabaration'}`}
              className={`flex gap-2 rounded cursor-pointer h-access items-center justify-center pl-2 pr-3 capitalize text-gray-500 hover:text-gray-800 bg-cyan-500 bg-opacity-25 backdrop-blur-sm  md:after:content-[attr(data-string)] ${owner ? 'pointer-events-auto' : 'pointer-events-none'}`}
              data-string={enableCollab ? 'Collab' : 'Solo'}
              onClick={() => {
                const formData = new FormData();
                formData.append('enable_collab', enableCollab ? 'false' : 'true');
                submit(formData, { method: 'POST' });
              }}>
              {enableCollab ? (
                <CollabIcon id="public-novel-public-icon" className="w-5 h-auto -scale-x-100" />
              ) : (
                <SoloIcon id="public-novel-private-icon" className="w-5 h-auto" />
              )}
            </button>
            <button
              type="button"
              title={`Novel YJS ${status}`}
              className={`flex gap-2 rounded cursor-pointer h-access items-center justify-center pl-2 pr-3 capitalize text-gray-500 hover:text-gray-800 ${status === 'disconnected' || status === 'initial' ? 'bg-red-400' : status === 'connecting' ? 'bg-blue-400' : 'bg-green-400'} bg-opacity-25 backdrop-blur-sm ${!isSynced && status === 'connecting' ? 'pointer-events-none' : 'pointer-events-auto'} md:after:content-[attr(data-string)]`}
              data-string={
                !isSynced && status === 'connecting'
                  ? 'Syncing'
                  : status === 'disconnected' || status === 'initial'
                    ? 'Disconnected'
                    : 'Connected'
              }
              onClick={() => (status === 'connected' ? room.disconnect() : room.reconnect())}>
              {!isSynced && status === 'connecting' ? (
                <SyncIcon id="lexical-sync" className="w-5 h-auto animate-spin" />
              ) : status === 'disconnected' || status === 'initial' ? (
                <DisconnectIcon id="lexical-disconnect" className="w-5 h-auto" />
              ) : (
                <ConnectIcon id="lexical-connect" className="w-5 h-auto" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setScrollLock(scrollLock === 'Chat' ? 'Novel' : 'Chat')}
              data-string="Chat"
              className="flex gap-2 rounded cursor-pointer h-access items-center justify-center pl-2 pr-3 capitalize text-gray-500 hover:text-gray-800 bg-white bg-opacity-25 backdrop-blur-sm  md:after:content-[attr(data-string)] relative">
              <div className={showChatNotif ? 'absolute top-1 right-1 flex gap-2 items-center z-50' : 'hidden'}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <ChatIcon id="public-novel-chat-icon" className="w-5 h-auto translate-x-0.5" />
            </button>
            <button
              type="button"
              title="Show Tutorial"
              data-string="Tutorial"
              onClick={() => setShowTutorial(true)}
              className="flex gap-2 rounded cursor-pointer h-access items-center justify-center pl-2 pr-3 capitalize text-gray-500 bg-yellow-300 hover:text-gray-800 bg-opacity-25 backdrop-blur-sm md:after:content-[attr(data-string)]">
              <HelpIcon id="help-icon" className="w-5 h-auto" />
            </button>
          </div>
        </div>
      </div>
      <input name="lexical" value={editorState} readOnly={true} className="hidden" />
      <CornerAlert ownerIsPresent={ownerIsPresent} ownerDetails={ownerInfo} init={!owner && init} />
      <TutorialModal setShowTutorial={setShowTutorial} showTutorial={showTutorial} />
    </LexicalComposer>
  );
}
