import { Form, Link, useNavigation } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { CreateDate } from '~/helpers/DateHelper';
import { NovelWithMemberIds } from '~/types';

import DialogWrapper from '~/components/DialogWrapper';
import { emptyContent } from '~/components/Lexical/helpers';

import { ArrowIcon, PenIcon, TrashIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import EditorTextPlugin from './EditorTextPlugin';

type DescriptionModelProps = {
  selectedNovel: NovelWithMemberIds | null;
  userId: string;
  members: { user_id: string }[];
  ownerId: string;
  close: () => void;
};

export function DescriptionModel({ selectedNovel, close, userId, ownerId, members = [] }: DescriptionModelProps) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const navigationState = useNavigation();
  const finishedDelete = 'loading' === navigationState.state && navigationState.formMethod === 'DELETE';
  const finishedPost = 'loading' === navigationState.state && navigationState.formMethod === 'POST';
  const isLoading = 'submitting' === navigationState.state && navigationState.formMethod === 'DELETE';
  const isLoadingUpdate = 'submitting' === navigationState.state && navigationState.formMethod === 'POST';
  const isLoadingPage =
    'loading' === navigationState.state && navigationState.location.pathname === `/dash/novel/${selectedNovel?.id}`;
  const member = members.some(user => user.user_id === userId);
  const isOwner = userId === ownerId;

  useEffect(() => {
    if (finishedDelete) {
      setOpenConfirm(false);
      close();
    }
  }, [close, finishedDelete]);

  useEffect(() => {
    if (finishedPost) {
      close();
    }
  }, [close, finishedPost]);

  const initialConfig = {
    namespace: 'DescriptionModal',
    nodes: [],
    editorState: JSON.stringify(selectedNovel?.description) || emptyContent,
    onError: (error: Error) => {
      throw error;
    },
    editable: false,
    theme: {
      paragraph: 'descriptionText'
    }
  };

  return (
    <DialogWrapper open={Boolean(selectedNovel)}>
      <div className="w-full md:max-w-[800px] md:p-4 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md flex-auto md:flex-1">
          <div className="w-full pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center bg-white">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize flex items-center gap-2">
              &nbsp;{selectedNovel?.title}&nbsp;&nbsp;&nbsp;
            </h3>
            <button className="crossButton" type="button" onClick={close}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full px-8 py-4 bg-white flex flex-col gap-10 flex-auto md:flex-1 mt-0.5">
            {selectedNovel && (
              <LexicalComposer initialConfig={initialConfig}>
                <EditorTextPlugin />
              </LexicalComposer>
            )}
            <div>
              <div>
                <p className="text-gray-500 text-sm">
                  <strong>Last Update:</strong> {selectedNovel?.updated_at && CreateDate(selectedNovel?.updated_at + 'Z', true)}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Members:</strong> {selectedNovel?.members?.length}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={() => setOpenConfirm(true)}
              value={selectedNovel?.id}
              title="selected_novel"
              data-string="Delete"
              className={isOwner ? 'deleteButton md:w-button w-icon md:after:content-[attr(data-string)]' : 'hidden'}>
              <TrashIcon className="w-5 h-auto" uniqueId="descript-delete" />
            </button>
            <Link
              to={`/dash/new?novel_id=${selectedNovel?.id}`}
              data-string="Edit"
              className={
                isOwner
                  ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-button bg-slate-700 hover:bg-slate-500 md:w-button w-icon gap-2 md:after:content-[attr(data-string)]'
                  : 'hidden'
              }>
              <PenIcon uniqueId="description-edit" className="w-6 h-auto" />
            </Link>
            <button
              className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-button bg-orange-700 hover:bg-orange-500 md:w-button w-icon gap-2 md:after:content-[attr(data-string)]"
              data-string="Back"
              type="button"
              onClick={close}>
              <ArrowIcon uniqueId="description-back" className="w-6 h-auto rotate-180" />
            </button>
            <Link
              to={`/dash/novel/${selectedNovel?.id}`}
              data-string={isLoadingPage ? '' : 'Next'}
              className={
                member ? 'confirmButton md:w-button w-icon gap-2 md:before:content-[attr(data-string)]' : 'hidden'
              }>
              {isLoadingPage ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-page-spinner" />
              ) : (
                <ArrowIcon uniqueId="description-next" className="w-6 h-auto" />
              )}
            </Link>
            <Form method="post" className={!member ? 'flex' : 'hidden'}>
              <fieldset disabled={isLoadingUpdate}>
                <button
                  name="selected_novel"
                  value={selectedNovel?.id}
                  data-string="Participate"
                  className="confirmButton md:w-wide-button w-icon md:before:content-[attr(data-string)]">
                  <ArrowIcon uniqueId="description-back" className="w-6 h-auto" />
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
      <DialogWrapper open={openConfirm}>
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md self-center w-full max-w-card-l">
          <div className="w-full pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center bg-white">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
              &#8197;Confirm Delete&nbsp;&nbsp;&nbsp;
            </h3>
            <button className="crossButton" type="button" onClick={() => setOpenConfirm(false)}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full py-8 px-4 bg-white text-gray-700 mt-0.5">
            Are you sure you would like to delete the novel{' '}
            <strong className="capitalize">{'"' + selectedNovel?.title + '" ?'}</strong>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
            <Form method="delete">
              <button
                title="delete novel"
                value={selectedNovel?.id}
                name="selected_novel"
                data-string={isLoading ? '' : 'Delete'}
                className="deleteButton md:after:content-[attr(data-string)] md:w-button w-icon">
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <TrashIcon uniqueId="delete-novel-confirm" svgColor="#fff" className="w-5 h-auto" />
                )}
              </button>
            </Form>
            <button
              type="button"
              onClick={() => setOpenConfirm(false)}
              data-string="Cancel"
              className="confirmButton md:after:content-[attr(data-string)] md:w-button w-icon">
              <ArrowIcon uniqueId="description-back" className="w-6 h-auto rotate-180" />
            </button>
          </div>
        </div>
      </DialogWrapper>
    </DialogWrapper>
  );
}
