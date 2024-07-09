import { Form, Link, useNavigation } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { CreateDate } from '~/helpers/DateHelper';
import { NovelWithMemberIds } from '~/types';

import DialogWrapper from '~/components/DialogWrapper';
import { emptyContent } from '~/components/Lexical/helpers';
import { ModalHeader } from '~/components/ModalHeader';
import PasswordInput from '~/components/PasswordInput';

import { ArrowIcon, MembersIcon, PenIcon, PrivateIcon, PublicIcon, UpdateIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import EditorTextPlugin from './EditorTextPlugin';

type DescriptionModalProps = {
  selectedNovel: NovelWithMemberIds | null;
  userId: string;
  members: { user_id: string }[];
  ownerId: string;
  close: () => void;
  isPrivate: boolean;
};

export function DescriptionModal({
  selectedNovel,
  close,
  userId,
  ownerId,
  members = [],
  isPrivate
}: DescriptionModalProps) {
  const [showPrivatePassword, setShowPrivatePassword] = useState(false);
  const [password, setPassword] = useState('');

  const navigationState = useNavigation();
  const finishedPost = 'loading' === navigationState.state && navigationState.formMethod === 'POST';
  const isLoadingUpdate = 'submitting' === navigationState.state && navigationState.formMethod === 'POST';
  const isLoadingPage =
    'loading' === navigationState.state && navigationState.location.pathname === `/dash/novel/${selectedNovel?.id}`;
  const member = members.some(user => user.user_id === userId);
  const isOwner = userId === ownerId;

  useEffect(() => {
    if (finishedPost) {
      setShowPrivatePassword(false);
      close();
    }
  }, [close, finishedPost]);

  useEffect(() => {
    if (!selectedNovel) setShowPrivatePassword(false);
  }, [selectedNovel]);

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
          <ModalHeader title={selectedNovel?.title || ''} close={close} />
          <div className="w-full px-8 py-4 gap-5 bg-white bg-opacity-75 backdrop-blur-sm flex flex-col flex-auto md:flex-1 mt-0.5">
            {selectedNovel && (
              <LexicalComposer initialConfig={initialConfig}>
                <EditorTextPlugin />
              </LexicalComposer>
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-3 w-full bg-white bg-opacity-75 backdrop-blur-sm justify-end px-2 py-1">
              <div
                title={isPrivate ? 'Private' : 'Public'}
                className="flex gap-2 w-fit rounded-lg font-semibold text-gray-800 border border-gray-500 flex-grow-0 bg-white capitalize px-2 py-1 md:after:content-[attr(title)]">
                {isPrivate ? (
                  <PrivateIcon className="w-5 h-auto" uniqueId="private-novel-icon" />
                ) : (
                  <PublicIcon className="w-6 h-auto" uniqueId="public-novel-icon" />
                )}
              </div>
              <div
                title={`Members: ${selectedNovel?.members?.length}`}
                data-mobile={selectedNovel?.members?.length}
                className="flex gap-2 w-fit rounded-lg font-semibold text-gray-800 border border-gray-500 flex-grow-0 bg-white capitalize px-2 py-1 md:after:content-[attr(title)] after:content-[attr(data-mobile)]">
                <MembersIcon className="w-5 h-auto" uniqueId="members-icons" />
              </div>
              <div
                title={`Update: ${selectedNovel?.updated_at && CreateDate(selectedNovel?.updated_at)}`}
                data-mobile={selectedNovel?.updated_at && CreateDate(selectedNovel?.updated_at)}
                className="flex gap-2 w-fit rounded-lg font-semibold text-gray-800 border border-gray-500 flex-grow-0 bg-white capitalize px-2 py-1 md:after:content-[attr(title)] after:content-[attr(data-mobile)]">
                <UpdateIcon className="w-5 h-auto" uniqueId="update-icons" />
              </div>
            </div>
          <div className="flex w-full justify-end bg-white bg-opacity-75 backdrop-blur-sm rounded-b-md p-2 gap-3 sticky bottom-0">
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
            <Form method="PUT" className={!member && !isPrivate ? 'flex' : 'hidden'}>
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
            <button
              type="button"
              onClick={() => setShowPrivatePassword(true)}
              data-string="Participate"
              className={
                !member && isPrivate
                  ? 'confirmButton md:w-wide-button w-icon md:before:content-[attr(data-string)]'
                  : 'hidden'
              }>
              <ArrowIcon uniqueId="description-back" className="w-6 h-auto" />
            </button>
          </div>
        </div>
      </div>
      <DialogWrapper open={showPrivatePassword}>
        <div className="w-full md:max-w-[600px] md:p-4 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
          <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md flex-auto md:flex-1">
            <ModalHeader title="Private Password" close={() => setShowPrivatePassword(false)} />
            <Form method="POST" className="w-full p-4 bg-white mt-0.5">
              <fieldset disabled={isLoadingUpdate}>
                <PasswordInput
                  title="Access Password"
                  id="access_novel_password"
                  placeholder="Enter Access Password"
                  value={password}
                  onChange={setPassword}
                />
                <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPrivatePassword(false)}
                    data-string="Cancel"
                    className="cancelButton md:after:content-[attr(data-string)] md:w-button w-icon">
                    <ArrowIcon uniqueId="description-back" className="w-6 h-auto rotate-180" />
                  </button>
                  <button
                    data-string="Submit"
                    name="selected_novel"
                    value={selectedNovel?.id}
                    className="confirmButton md:w-button w-icon md:before:content-[attr(data-string)]">
                    <ArrowIcon uniqueId="description-back" className="w-6 h-auto" />
                  </button>
                </div>
              </fieldset>
            </Form>
          </div>
        </div>
      </DialogWrapper>
    </DialogWrapper>
  );
}
