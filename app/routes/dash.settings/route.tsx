import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSubmit
} from '@remix-run/react';

import { useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';
import { UserDataEntry } from '~/types';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import DialogWrapper from '~/components/DialogWrapper';
import TitleInput from '~/components/TitleInput';

import { ArrowIcon, TrashIcon, UpdateIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashOutletContext } from '../dash/route';
import { SettingsAction } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function action({ request }: ActionFunctionArgs) {
  return SettingsAction(request);
}

export default function DashSettings() {
  const { user, supabase } = useOutletContext<DashOutletContext>();
  const actionData = useActionData() as { data: UserDataEntry; error: Error };
  const navigationState = useNavigation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [colorSelect, setColorSelect] = useState(user.color);
  const [username, setUsername] = useState(user.username);
  const [imageFile, setImage] = useState<File | null>(null);
  const [showDelModal, setShowDelModal] = useState(false);

  const disabled = username === user.username && !imageFile && user.color === colorSelect;
  const isLoading = 'submitting' === navigationState.state;
  const formDisabled =
    ['submitting', 'loading'].includes(navigationState.state) && navigationState.formMethod === 'POST';
  const loadingDash = 'loading' === navigationState.state && navigationState.location.pathname === '/dash';
  const LocalStrings = LOCALES.settings;

  useEffect(() => {
    const channel = supabase
      .channel('user location', { config: { presence: { key: user.id }, broadcast: { self: true } } })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        return channel.track({ novel_id: '', page_id: '', room: 'Room: User Settings', user_id: user.id });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user, user.id]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: actionData.error?.message || 'Error Updating Profile'
      });
      window.dispatchEvent(sceneEvent);
    } else if (imageFile) setImage(null);
  }, [actionData, imageFile]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative m-auto md:mb-0 md:pb-10 py-10 pb-[100px]">
      <h1 className="text-red-700 text-4xl text-center [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {LocalStrings.title}
      </h1>
      <Form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData();
          if (imageFile) formData.append('avatar', imageFile);
          formData.append('color', colorSelect);
          formData.append('username', username);
          submit(formData, { method: 'POST', encType: 'multipart/form-data' });
        }}
        aria-label="update-account"
        className="p-4 md:w-[700px] w-[360px] max-w-full">
        <fieldset className="w-full flex flex-col justify-center items-center md:gap-3 gap-6" disabled={formDisabled}>
          <div
            className={`w-full flex justify-center items-center md:flex-row flex-col rounded-lg shadow-xl md:gap-10 gap-3 md:px-8 px-4 py-8 ${user.color} bg-opacity-65 backdrop-blur-lg`}>
            <AvatarInput title="Upload file" id="avatar" setImage={setImage} imageSrc={user?.avatar} />
            <div className="flexCenter flex-col gap-3 flex-auto md:w-auto w-full">
              <TitleInput
                labelColor="text-gray-600"
                textSize="text-left font-medium"
                title={LocalStrings.username}
                id="username"
                value={username}
                placeholder="Enter New Username..."
                onChange={setUsername}
              />
              <ColorInput
                textAlign="text-left"
                textSize="font-medium"
                title={LocalStrings.color}
                id="color"
                value={colorSelect}
                onChange={setColorSelect}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full justify-center">
            <button
              type="button"
              data-string={loadingDash ? '' : 'Back'}
              onClick={() => {
                state && (state?.novel_id ||  state?.page_id) ? navigate(-1) : navigate('/dash');
              }}
              className="cancelButton md:w-wide-button md:after:content-[attr(data-string)] w-icon">
              {loadingDash ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="dash-spinner" />
              ) : (
                <ArrowIcon uniqueId="settings-back" className="w-6 h-auto rotate-180" />
              )}
            </button>
            <button
              className="confirmButton disabled:bg-gray-300 md:after:content-[attr(data-string)] md:w-wide-button w-icon"
              type="submit"
              data-string={isLoading ? '' : 'Update'}
              disabled={disabled}>
              {isLoading ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
              ) : (
                <UpdateIcon uniqueId="settings-save" className="w-7 h-auto" />
              )}
            </button>
          </div>
        </fieldset>
      </Form>
      <button
        type="button"
        onClick={() => setShowDelModal(true)}
        className="absolute top-3 right-3 floatingDeleteButton">
        <TrashIcon uniqueId="deleteaccount" svgColor="currentColor" className="w-4 h-auto" />
      </button>
      <DialogWrapper open={showDelModal}>
        <Form
          method="delete"
          className="w-full max-w-card-l md:p-4 p-0 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
          <fieldset disabled={formDisabled}>
            <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md flex-auto md:flex-1">
              <div className="w-full pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center bg-white">
                <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
                  &#8197;Delete User Account&nbsp;&nbsp;&nbsp;
                </h3>
                <button className="crossButton" type="button" onClick={() => setShowDelModal(false)}>
                  <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
                </button>
              </div>
              <div className="w-full py-4 px-4 bg-white rounded-b-md flex flex-col gap-6">
                <p className="text-base text-gray-700 whitespace-pre-wrap">
                  {
                    'By deleting this account will be remove all associated novels and comments\n\nAre you sure you want to delete this user account?'
                  }
                </p>
                <div className="flex w-full justify-end bg-white rounded-b-md gap-3">
                  <button className="deleteButton md:after:content-['Delete'] md:w-button w-icon">
                    <TrashIcon uniqueId="delete-page" svgColor="#fff" className="w-5 h-auto" />
                  </button>
                  <button
                    type="button"
                    className="confirmButton py-2.5 md:after:content-['Back'] md:w-button w-icon"
                    onClick={() => setShowDelModal(false)}>
                    <ArrowIcon uniqueId="settings-delete-back" className="w-6 h-auto rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
        </Form>
      </DialogWrapper>
    </div>
  );
}
