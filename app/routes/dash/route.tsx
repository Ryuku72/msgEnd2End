import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useOutletContext, useSubmit } from '@remix-run/react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createBrowserClient } from '@supabase/ssr';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';
import { UserDataEntry } from '~/types';

import DashNavBar from './components/DashNavBar';
import { DashLoader } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return DashLoader(request);
}

export type DashOutletContext = {
  user: UserDataEntry;
  supabase: SupabaseClient;
  channel: RealtimeChannel;
  img_url: string;
  scrollLock: string;
  setScrollLock: (state: string) => void;
};

export default function Dash() {
  const { user, env } = useLoaderData<{
    user: UserDataEntry;
    env: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string; SUPABASE_IMG_STORAGE: string };
  }>();
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const submit = useSubmit();
  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  const [scrollLock, setScrollLock] = useState<'Chat' | 'Comments' | 'Novel'>('Novel');
  const mounted = useRef(false);


  const handlelogout = useCallback(() => {
    const formData = new FormData();
    formData.append('last_logout', new Date().toISOString());
    submit(formData, { method: 'POST', action: '/api/last_logout', navigate: false });
  }, [submit]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      if (mounted.current) handlelogout();
      mounted.current = false;
    };
  }, [handlelogout]);


  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <div
      className={`w-full flex flex-auto flex-row relative ${scrollLock !== 'Novel' ? 'md:overflow-visible overflow-hidden' : 'overflow-visible'}`}
      id="dash-default">
      <DashNavBar user={user} />
      <Outlet
        context={{ user, supabase, img_url: env.SUPABASE_IMG_STORAGE + 'public/avatars/', scrollLock, setScrollLock }}
      />
    </div>
  );
}
