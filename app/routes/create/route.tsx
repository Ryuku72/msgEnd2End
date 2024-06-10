import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthResponse } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import AvatarInput from './components/AvatarSelectInput';
import ColorInput from './components/ColorInput';
import { CreateAction } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function action({ request }: ActionFunctionArgs) {
  return CreateAction(request);
}

export default function Create() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const actionData = useActionData() as AuthResponse & { success: boolean };
  const navigationState = useNavigation();
  const submit = useSubmit();

  const [colorSelect, setColorSelect] = useState('bg-pastel-black');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImage] = useState<File | null>(null);

  const isLoading = ['submitting', 'loading'].includes(navigationState.state);
  const LocalStrings = LOCALES.create;

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 2
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: actionData.error?.message || actionData.error.code
      });
      window.dispatchEvent(sceneEvent);
    }
  }, [actionData]);

  return (
    <PublicLayout>
      <div className="flex flex-col m-auto gap-4 w-full">
        <div className="max-w-full self-center">
          <Form
            aria-label="create-account"
            method="post"
            onSubmit={e => {
              e.preventDefault();
              const formData = new FormData();
              if (imageFile) formData.append('avatar', imageFile);
              formData.append('email', email);
              formData.append('password', password);
              formData.append('color', colorSelect);
              formData.append('username', username);
              submit(formData, { method: 'post', encType: 'multipart/form-data' });
            }}
            className="w-full max-w-lg flex rounded-lg shadow-xl p-4 md:px-12 md:py-8 bg-white bg-opacity-35 backdrop-blur-sm">
            <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={isLoading}>
              <div className="flex gap-6 flex-wrap justify-center items-center">
                <AvatarInput title={LocalStrings.avatar} id="avatar" setImage={setImage} />
                <ColorInput
                  title={LocalStrings.color}
                  id="color"
                  value={colorSelect}
                  onChange={setColorSelect}
                />
              </div>
              <TitleInput
                title={LocalStrings.username}
                id="username"
                value={username}
                placeholder={LocalStrings.username_placeholder}
                onChange={setUsername}
              />
              <TitleInput
                title={LocalStrings.email}
                id="email"
                placeholder={LocalStrings.email_placeholder}
                value={email}
                onChange={setEmail}
                type="email"
              />
              <PasswordInput
                title={LocalStrings.password}
                id="password"
                placeholder={LocalStrings.password_placeholder}
                value={password}
                onChange={setPassword}
              />
              <div className="w-full flex items-center gap-3 justify-center pt-3">
                <Link to="/" className="primaryButton py-2.5">
                  {LocalStrings.primary_button}
                </Link>
                <button
                  className={`secondaryButton ${isLoading ? 'py-0.5' : 'py-2.5'}`}
                  type="submit"
                  disabled={false}>
                  {isLoading ? (
                    <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                  ) : (
                    LocalStrings.secondary_button
                  )}
                </button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
    </PublicLayout>
  );
}
