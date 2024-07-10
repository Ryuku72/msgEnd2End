import DialogWrapper from '~/components/DialogWrapper';
import { ModalHeader } from '~/components/ModalHeader';

import { ArrowIcon, TrashIcon } from '~/svg';

import { Comment, Thread } from '../helpers/comments';

export function DeletePopupModal({
  open,
  close,
  commentOrThread,
  deleteCommentOrThread,
  thread = undefined,
  title
}: {
  open: boolean;
  close: () => void;
  title: string;
  thread?: Thread;
  commentOrThread: Comment | Thread;
  deleteCommentOrThread: (
    comment: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
}) {
  return (
    <DialogWrapper open={open}>
      <div className="w-full max-w-card-l md:p-4 p-0 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md flex-auto md:flex-1">
          <ModalHeader title={title} close={close} />
          <div className="w-full py-4 px-4 bg-white rounded-b-md flex flex-col gap-6">
            <p className="text-base text-gray-700">Are you sure you want to delete this {commentOrThread.type}?</p>
            <div className="flex w-full justify-end bg-white rounded-b-md gap-3">
              <button
                type="button"
                data-string="Delete"
                className="deleteButton w-button after:content-[attr(data-string)]"
                onClick={() => {
                  deleteCommentOrThread(commentOrThread, thread);
                  close();
                }}>
                <TrashIcon id="delete-comment-icon" svgColor="#fff" className="w-5 h-auto" />
              </button>
              <button
                type="button"
                data-string="Cancel"
                className="confirmButton w-button after:content-[attr(data-string)]"
                onClick={() => {
                  close();
                }}>
                <ArrowIcon id="settings-delete-back" className="w-6 h-auto rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
}
