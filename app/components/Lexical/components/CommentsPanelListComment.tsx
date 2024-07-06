import { useState } from 'react';

import { CreateDate } from '~/helpers/DateHelper';

import { StickyIcon, TrashIcon } from '~/svg';

import { Comment, Thread } from '../helpers/comments';
import CommentsComposer from './CommentComposer';
import { DeletePopupModal } from './DeletePopUpModal';

export function CommentsPanelList({
  comment,
  deleteComment,
  thread,
  rtf
}: {
  comment: Comment;
  deleteComment: (
    commentOrThread: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  rtf: Intl.RelativeTimeFormat;
  thread?: Thread;
}): JSX.Element {
  const seconds = comment?.timeStamp ? Math.round((comment.timeStamp - Date.now()) / 1000) : 0;
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const date = CreateDate(comment?.timeStamp);
  const [showModal, setShowModal] = useState(false);


  return (
    <li
      data-id="CommentPlugin_CommentsPanel_List_Comment"
      className="flex flex-col w-full py-2 first:py-3 first:pl-1 pl-3 first:border-l-0 border-l-[5px] first:[&>div]:pl-0 &>div]:pl-2 border-gray-200 relative transition-all ease-linear duration-200 group">
      <div className="flex flex-col w-full pr-8">
        <p
          data-id="CommentPlugin_CommentsPanel_List_Details"
          className="text-gray-600 flex gap-1 text-sm w-full pr-[45px]">
          <span className="font-bold capitalize">{comment.author}</span>
          <span className="text-gray-400">
            &#8226;{' '}
            {seconds > -10
              ? 'Just now'
              : minutes > -60
                ? rtf.format(minutes, 'minute')
                : hours > -24
                  ? rtf.format(hours, 'hours')
                  : date}
          </span>
        </p>
        <button
          type="button"
          title="delete comment"
          onClick={() => setShowModal(true)}
          className={
            comment.deleted
              ? 'hidden'
              : 'flex right-3 absolute top-2.5 rounded cursor-pointer w-access h-[30px] py-1 justify-center text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100'
          }>
          <TrashIcon className="w-4 h-auto" uniqueId="Comment-delete" />
        </button>
        <p
          className={`text-gray-700 pb-2 text-sm font-light whitespace-pre-wrap ${comment.deleted ? 'opacity-50' : 'opacity-100'}`}>
          {comment.content}
        </p>
        <DeletePopupModal
          open={showModal}
          close={() => setShowModal(false)}
          commentOrThread={comment}
          deleteCommentOrThread={deleteComment}
          thread={thread}
          title="Delete Comment"
        />
      </div>
    </li>
  );
}

export function CommentThread({
  handleClickThread,
  commentOrThread,
  rtf,
  markNodeMapHasId,
  activeIdExists,
  setShowModal,
  showModal,
  deleteCommentOrThread,
  submitAddComment,
  authorDetails
}: {
  authorDetails: { name: string; color: string };
  handleClickThread: () => void;
  commentOrThread: Thread;
  rtf: Intl.RelativeTimeFormat;
  setShowModal: (state: boolean) => void;
  showModal: boolean;
  deleteCommentOrThread: (commentOrThread: Comment | Thread, thread?: Thread) => void;
  submitAddComment: (commentOrThread: Comment | Thread, isInlineComment: boolean, thread?: Thread) => void;
  markNodeMapHasId: boolean;
  activeIdExists: boolean;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <li
      data-id="CommentPlugin_CommentsPanel_List_Thread"
      className={`w-full relative transition-all duration-200 ease-linear items-end ${
        markNodeMapHasId ? 'cursor-pointer' : 'cursor-default'
      } ${activeIdExists ? 'pl-0' : 'pl-3'}`}
      onClick={() => handleClickThread()}>
      <div className={`${activeIdExists ? 'bg-white' : 'bg-[#fafafa] rounded-l-md'} pt-4 pb-2 backdrop-blur-sm`}>
        <div data-id="CommentPlugin_CommentsPanel_List_Thread_QuoteBox" className="pt-3 group">
          <blockquote
            data-id="CommentPlugin_CommentsPanel_List_Thread_Quote"
            className="mx-3 text-gray-300 font-medium pr-[40px]">
            {'> '}
            <span
              className={`text-gray-700 p-1 pl-0.5 font-bold mark-${commentOrThread.color} ${activeIdExists ? 'bg-opacity-30 border-b-2 border-opacity-60' : 'bg-opacity-70 border-b-2 border-opacity-100'}`}>
              {commentOrThread.quote}
            </span>
          </blockquote>
          {/* INTRODUCE DELETE THREAD HERE*/}
          <button
            type="button"
            title="delete quote"
            onClick={() => setShowModal(true)}
            className="absolute flexCenter top-4 right-5 rounded cursor-pointer w-access h-access py-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 flex whitespace-pre">
            <StickyIcon className="w-3 h-auto rotate-45" uniqueId="Comment-sticky" />
            <TrashIcon className="w-4 h-auto translate-y-2" uniqueId="Comment-quote" />
          </button>
          <DeletePopupModal
            open={showModal}
            close={() => setShowModal(false)}
            title="Delete Thread"
            commentOrThread={commentOrThread}
            deleteCommentOrThread={deleteCommentOrThread}
          />
        </div>
        <ul data-id="CommentPlugin_CommentsPanel_List_Thread_Comments" className="pl-3 list-none flex flex-col">
          {commentOrThread.comments.map(comment => (
            <CommentsPanelList
              key={comment.id}
              comment={comment}
              deleteComment={deleteCommentOrThread}
              thread={commentOrThread}
              rtf={rtf}
            />
          ))}
        </ul>
        <div data-id="CommentPlugin_CommentsPanel_List_Thread_Editor" className="relative pt-5 pr-3 flex">
          <CommentsComposer
            submitAddComment={submitAddComment}
            thread={commentOrThread}
            placeholder="Reply to comment..."
            authorDetails={authorDetails}
          />
        </div>
      </div>
    </li>
  );
}
