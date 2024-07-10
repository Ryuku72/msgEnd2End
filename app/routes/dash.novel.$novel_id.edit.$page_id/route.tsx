import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigate, useNavigation, useParams, useSubmit } from '@remix-run/react';

import { useState } from 'react';

import { Page, PagePrivateDetails } from '~/types';

import DialogWrapper from '~/components/DialogWrapper';
import { ModalHeader } from '~/components/ModalHeader';
import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';

import { ArrowIcon, TrashIcon, UpdateIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashPageIdEditAction, DashPageIdEditLoader } from './services';

export function loader(request: LoaderFunctionArgs) {
  return DashPageIdEditLoader(request);
}

export function action(data: ActionFunctionArgs) {
  return DashPageIdEditAction(data);
}

export default function DashPageIdEdit() {
  const loaderData = useLoaderData() as { page: Page; details: PagePrivateDetails };
  const navigationState = useNavigation();
  const { novel_id } = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [title, setTitle] = useState(loaderData?.page.reference_title || '');
  const [password, setPassword] = useState(loaderData?.details.password || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPrivate, setIsPrivate] = useState(loaderData?.page.private || false);
  const [enableCollab, setEnableCollab] = useState(loaderData?.page.enable_collab || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('page_title', title);
    data.append('page_password', password);
    data.append('page_isPrivate', String(isPrivate));
    data.append('page_enable_collab', String(enableCollab));
    submit(data, { method: 'POST' });
  };

  return (
    <DialogWrapper open={true}>
      <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md self-center w-full max-w-[800px]">
        <ModalHeader title="Edit Page Details" close={() => navigate(`/dash/novel/${novel_id}`)} />
        <Form method="POST" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col pt-4 pb-8 px-4 bg-white bg-opacity-75 backdrop-blur-sm text-gray-700 mt-0.5 gap-2">
            <TitleInput
              title="Page Title"
              id="page_title"
              value={title}
              onChange={setTitle}
              placeholder="Enter Page Title"
            />
            <PasswordInput
              title="Page Password when Private"
              id="page_password"
              placeholder="Enter Page Password"
              value={password}
              required={false}
              onChange={setPassword}
            />
            <div className="flex gap-3 items-center pt-2">
              <p className="text-sm font-medium text-gray-600 w-[100px]">Enable Private</p>
              <button type="button" onClick={() => setIsPrivate(!isPrivate)} className="flex flex-col">
                <div className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" readOnly={true} checked={isPrivate} />
                  <div className="peer h-4 w-11 rounded border bg-purple-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-500 peer-checked:after:translate-x-full peer-focus:ring-purple-300" />
                </div>
              </button>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <p className="text-sm font-medium text-gray-600 w-[100px]">Enable Collab</p>
              <button type="button" onClick={() => setEnableCollab(!enableCollab)} className="flex flex-col">
                <div className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" readOnly={true} checked={enableCollab} />
                  <div className="peer h-4 w-11 rounded border bg-cyan-100 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-600 peer-checked:after:translate-x-full peer-focus:ring-cyan-300" />
                </div>
              </button>
            </div>
          </div>

          <div className="flex w-full justify-end bg-white bg-opacity-75 backdrop-blur-sm rounded-b-md p-2 gap-3">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="delete page"
              data-string={navigationState.formMethod === 'DELETE' ? '' : 'Delete'}
              className="deleteButton md:after:content-[attr(data-string)] md:w-button w-icon">
              {navigationState.formMethod === 'DELETE' ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" id="index-spinner" />
              ) : (
                <TrashIcon id="delete-page" svgColor="#fff" className="w-5 h-auto" />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/dash/novel/${novel_id}`)}
              data-string="Cancel"
              className="cancelButton md:after:content-[attr(data-string)] md:w-button w-icon">
              <ArrowIcon id="settings-delete-back" className="w-6 h-auto rotate-180" />
            </button>
            <button
              type="submit"
              data-string={navigationState.formMethod === 'POST' ? '' : 'Update'}
              className="confirmButton md:after:content-[attr(data-string)] md:w-button w-icon">
              {navigationState.formMethod === 'POST' ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" id="index-spinner" />
              ) : (
                <UpdateIcon id="settings-delete-back" className="w-6 h-auto rotate-180" />
              )}
            </button>
          </div>
        </Form>
      </div>
      <DialogWrapper open={confirmDelete}>
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md self-center w-full max-w-card-l">
          <ModalHeader title="Confirm Delete" close={() => setConfirmDelete(false)} />
          <div className="w-full flex flex-col py-8 px-4 bg-white text-gray-700 mt-0.5 gap-2">
            <p>Are you sure you would like to delete the following page?</p>
            <strong className="capitalize">{loaderData?.page.reference_title}</strong>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
            <Form method="delete">
              <button
                title="delete page"
                data-string={navigationState.formMethod === 'DELETE' ? '' : 'Delete'}
                className="deleteButton md:after:content-[attr(data-string)] md:w-button w-icon">
                {navigationState.formMethod === 'DELETE' ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" id="index-spinner" />
                ) : (
                  <TrashIcon id="delete-page" svgColor="#fff" className="w-5 h-auto" />
                )}
              </button>
            </Form>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              data-string="Cancel"
              className="confirmButton md:after:content-[attr(data-string)] md:w-button w-icon">
              <ArrowIcon id="settings-delete-back" className="w-6 h-auto rotate-180" />
            </button>
          </div>
        </div>
      </DialogWrapper>
    </DialogWrapper>
  );
}
