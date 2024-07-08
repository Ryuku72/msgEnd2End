/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSearchParams,
  useSubmit
} from '@remix-run/react';

import { useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';
import { Novel, NovelPrivateDetails } from '~/types';

import DialogWrapper from '~/components/DialogWrapper';
import { emptyContent } from '~/components/Lexical/helpers';
import { ModalHeader } from '~/components/ModalHeader';
import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';

import { ArrowIcon, TrashIcon, TypeWriterIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashOutletContext } from '../dash/route';
import PlainTextEditor from './components/PlainTextEditor';
import { DashNewAction, DashNewLoader } from './services';

export function loader(data: LoaderFunctionArgs) {
  return DashNewLoader(data);
}

export function action(data: ActionFunctionArgs) {
  return DashNewAction(data);
}

export default function DashNew() {
  const library = useLoaderData<{ novel: Novel; private: NovelPrivateDetails }>();
  const { user, supabase } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();

  const descriptionState = library?.novel?.description ? JSON.stringify(library?.novel?.description) : emptyContent;
  const [draftNovelTitle, setDraftNovelTitle] = useState(library?.novel?.title || '');
  const [draftNovelDescription, setDraftNovelDescription] = useState(descriptionState);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [textLength, setTextLength] = useState(0);
  const [password, setPassword] = useState(library?.private.password || '');
  const [novelIsPrivate, setNovelIsPrivate] = useState(library?.novel?.private || false);

  const searchNovelId = searchParams.get('novel_id');
  const LocalStrings = LOCALES.dash.new;
  const isDashLoading = 'loading' === navigationState.state && navigationState.location.pathname === '/dash';
  const resetState =
    navigationState.state === 'loading' &&
    !navigationState.formMethod &&
    navigationState.location.pathname === '/dash/new';

  useEffect(() => {
    if (resetState) return;
    setDraftNovelTitle(library?.novel?.title || '');
    setDraftNovelDescription(JSON.stringify(library?.novel?.description) || '');
  }, [library, resetState]);

  useEffect(() => {
    if (navigationState.formMethod === 'DELETE') setOpenConfirm(false);
  }, [navigationState.formMethod]);

  useEffect(() => {
    const channel = supabase
      .channel('user location', { config: { presence: { key: user.id }, broadcast: { self: true } } })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        channel.track({
          novel_id: searchNovelId || '',
          page_id: '',
          room: searchNovelId ? `Room: Updating ${draftNovelTitle} Details` : 'Room: New Novel',
          user_id: user.id
        });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [draftNovelTitle, searchNovelId, supabase, user.id]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 pt-10 pb-[100px] md:pb-20 gap-6 m-auto">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{searchNovelId ? 'Update Details' : LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="w-full max-w-[1250px] flex flex-wrap justify-between items-center bg-slate-50 backdrop-blur-sm bg-opacity-55 rounded-lg">
        <Form method="post" className="flex w-full py-4 px-2 md:px-6" onSubmit={e => {
          e.preventDefault();
          const data = new FormData();
          data.append('novel-title', draftNovelTitle);
          data.append('novel-password', password);
          data.append('novel-description', draftNovelDescription);
          data.append('novel-private', String(novelIsPrivate));
          submit(data, { method: 'POST' });
        }}>
          <fieldset className="flex w-full flex-col gap-5">
            <TitleInput
              title={LocalStrings.primary_input}
              id="novel-title"
              value={draftNovelTitle}
              placeholder={LocalStrings.primary_input_placeholder}
              onChange={setDraftNovelTitle}
              minLength={3}
            />
            <PlainTextEditor
              title={LocalStrings.secondary_input}
              id="novel-description"
              value={draftNovelDescription}
              placeholder={LocalStrings.secondary_input_placeholder}
              onChange={setDraftNovelDescription}
              textLength={textLength}
              setTextLength={setTextLength}
              clearCondition={resetState}
            />
            <PasswordInput
              title="Novel Password when Private"
              id="novel-password"
              placeholder="Enter Novel Password"
              value={password}
              onChange={setPassword}
            />
             <div className="flex gap-3 items-center">
              <p className="text-sm font-medium text-gray-600 w-[100px]">Enable Private</p>
              <button type="button" value={novelIsPrivate ? 1 : 0} onClick={() => setNovelIsPrivate(!novelIsPrivate)} className="flex flex-col">
                <div className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" readOnly={true} checked={Boolean(novelIsPrivate)} />
                  <div className="peer h-4 w-11 rounded border bg-purple-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-500 peer-checked:after:translate-x-full peer-focus:ring-green-300" />
                </div>
              </button>
            </div>

            <div className="w-full flex gap-3 flex-wrap mt-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  state && (state?.novel_id || state?.page_id) ? navigate(-1) : navigate('/dash');
                }}
                data-string={isDashLoading ? '' : 'Back'}
                className="cancelButton md:after:content-[attr(data-string)] md:w-button w-icon">
                {isDashLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="dash-back-spinner" />
                ) : (
                  <ArrowIcon uniqueId="dash-new-back" className="w-6 h-auto rotate-180" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpenConfirm(true)}
                data-string="Delete"
                className={
                  library?.novel
                    ? 'deleteButton md:w-button w-icon md:after:content-[attr(data-string)]'
                    : 'hidden'
                }>
                <TrashIcon className="w-5 h-auto" uniqueId="descript-delete" />
              </button>
              <button
                className="confirmButton md:after:content-[attr(data-string)] md:w-button w-icon !gap-2.5"
                data-string={
                  navigationState.formMethod === 'POST'
                    ? ''
                    : searchNovelId
                      ? 'Update'
                      : LocalStrings.primary_button
                }>
                {navigationState.formMethod === 'POST' ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <TypeWriterIcon uniqueId="new-dash-save" className="w-5 h-auto" />
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
      <DialogWrapper open={openConfirm}>
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md self-center w-full max-w-card-l">
          <ModalHeader title="Confirm Delete" close={() => setOpenConfirm(false)} />
          <div className="w-full py-8 px-4 bg-white text-gray-700 mt-0.5">
            Are you sure you would like to delete the novel{' '}
            <strong className="capitalize">{'"' + library?.novel.title + '" ?'}</strong>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
            <Form method="delete">
              <button
                title="delete novel"
                data-string={navigationState.formMethod === 'DELETE' ? '' : 'Delete'}
                className="deleteButton md:after:content-[attr(data-string)] md:w-button w-icon">
                {navigationState.formMethod === 'DELETE' ? (
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
    </div>
  );
}
