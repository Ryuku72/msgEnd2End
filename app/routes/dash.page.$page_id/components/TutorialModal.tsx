import DialogWrapper from '~/components/DialogWrapper';

import {
  ChatIcon,
  CommentsIcon,
  ConnectIcon,
  DisconnectIcon,
  MicIcon,
  PrivateNovelIcon,
  PublicNovelIcon,
  StickyIcon,
  SyncIcon
} from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';

export type TutorialModalProps = {
  showTutorial: boolean;
  setShowTutorial: (state: boolean) => void;
};

export default function TutorialModal({ showTutorial, setShowTutorial }: TutorialModalProps) {
  return (
    <DialogWrapper open={showTutorial}>
      <div className="w-full md:max-w-[800px] flex gap-1 text-mono">
        <div className="w-full flex flex-col gap-1 bg-white bg-opacity-50 rounded-lg overflow-auto">
          <div className="flex justify-between items-center pt-4 px-6 pb-2 bg-black bg-opacity-75 backdrop-blur-sm text-white rounded-t-lg">
            <h3 className="font-medium text-xl underline underline-offset-4 capitalize flex items-center gap-2">
              &nbsp;Tutorial&nbsp;&nbsp;&nbsp;
            </h3>
            <button className="crossButton text-white" type="button" onClick={() => setShowTutorial(false)}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full py-4 px-6 bg-black bg-opacity-75 backdrop-blur-sm text-white rounded-b-lg flex flex-col gap-3">
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-orange-500 flex-shrink-0 flexCenter">
                <PublicNovelIcon uniqueId="public-novel-tutorial-public-icon" className="w-5 h-auto -scale-x-100" />
              </div>
              <p>
                <em>This is the Public Icon.</em> When enabled, all participants can actively contribute to the novel
                writing process.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-purple-400 flex-shrink-0 flexCenter">
                <PrivateNovelIcon uniqueId="public-novel-tutorial-private-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is the Private Icon.</em> When enabled, only the owner can contribute to the novel writing
                process, but you can still leave comments.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-gray-400 flex-shrink-0 flexCenter">
                <MicIcon uniqueId="public-novel-tutorial-mic-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is Speach to Text Icon.</em> When this is turned on, you will be able to contribute using your
                voice instead of typing.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-pink-400 flex-shrink-0 flexCenter">
                <CommentsIcon uniqueId="public-novel-chat-sync-icon" className="w-5 h-auto -scale-x-100" />
              </div>
              <p>
                <em>This is the Comment Tab Icon.</em> By clicking here, you will be able to see all comments related to
                this page.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-white flex-shrink-0 flexCenter">
                <ChatIcon uniqueId="public-novel-chat-icon" className="w-5 h-auto text-gray-700" />
              </div>
              <p>
                <em>This is the Chat Tab Icon.</em> By clicking here you will be able to chat to other memebers of this
                page. (Currently Work in Progress)
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-yellow-400 flex-shrink-0 flexCenter">
                <StickyIcon uniqueId="public-novel-tutorial-comment-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is the Add Comment Icon.</em> When you highlight text, you will see the Add Comment icon. By
                clicking this button, you can add a comment.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-green-400 flex-shrink-0 flexCenter">
                <ConnectIcon uniqueId="public-novel-tutorial-connect-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is the Connected Icon.</em> This indicates that the page has connected to the database and is
                synchronized with all other users.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-red-400 flex-shrink-0 flexCenter">
                <DisconnectIcon uniqueId="public-novel-tutorial-disconnect-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is the Disconnected Icon.</em> This indicates that the page is not connected to the database
                and may be out of sync with other users.
              </p>
            </div>
            <div className="w-full border-b-2 border-white pt-2 pb-4 flex gap-3 items-center">
              <div className="w-access h-access rounded bg-blue-400 flex-shrink-0 flexCenter">
                <SyncIcon uniqueId="public-novel-tutorial-sync-icon" className="w-5 h-auto" />
              </div>
              <p>
                <em>This is the Syncing Icon.</em> This indicates that the page is attempting to connect to the database
                and synchronize with other users.
              </p>
            </div>
            <div className="w-full flex justify-end">
              <button type="button" className="cancelButton w-button h-access" onClick={() => setShowTutorial(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
}
