import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useOutletContext } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';

import { ArrowIcon, LoginIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { LoginAction, LoginLoader } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return LoginLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return LoginAction(request);
}

export default function Login() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const navigationState = useNavigation();
  const actionData = useActionData() as AuthTokenResponsePassword;

  const [signInValue, setSignInValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const isLoading = ['submitting', 'loading'].includes(navigationState.state) && navigationState.formMethod === 'POST';

  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 3
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: actionData.error?.message || 'Incorrect Email or Password'
      });
      window.dispatchEvent(sceneEvent);
    }
  }, [actionData]);

  const LocalStrings = LOCALES.login;

  return (
    <PublicLayout>
      <div className="flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <h1 className="text-red-700 text-6xl font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LOCALES.login.title}
        </h1>
        <Form
          aria-label="login"
          method="POST"
          className="flex w-full flex-col gap-3 bg-white bg-opacity-25 backdrop-blur-sm rounded-lg shadow-xl px-8 py-6">
          <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={isLoading}>
            <TitleInput
              title="Email"
              type="email"
              id="user-email"
              value={signInValue}
              onChange={setSignInValue}
              placeholder="jojo@email.com"
            />
            <PasswordInput
              title="Password"
              id="user-password"
              value={passwordValue}
              onChange={setPasswordValue}
              placeholder="****"
            />
            <div className="w-full flex items-center gap-3 justify-center pt-3">
              <Link
                to="/"
                className="cancelButton after:content-[attr(data-string)] w-button"
                data-string={LocalStrings.primary_button}>
                <ArrowIcon uniqueId="login-back" className="w-6 h-auto rotate-180" />
              </Link>
              <button
                className="confirmButton after:content-[attr(data-string)] w-button"
                type="submit"
                disabled={false}
                data-string={isLoading ? '' : LocalStrings.secondary_button}>
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <LoginIcon uniqueId="login-next" className="w-6 h-auto" />
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    </PublicLayout>
  );
}
