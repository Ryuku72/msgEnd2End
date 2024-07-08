/* eslint-disable no-console */
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import { initServer } from '~/services/API';

export async function DashLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers, env } = await initServer(request);

  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    const avatarURL = user?.user_metadata?.avatar || '';
    if (!user) return redirect('/', { headers });

    const userData: UserDataEntry = {
      avatar: avatarURL ? env.SUPABASE_IMG_STORAGE + 'public/avatars/' + avatarURL : null,
      id: user?.id || '',
      username: user?.user_metadata.username || 'Not Found',
      color: user?.user_metadata.color || '#aeaeae',
      tutorial_library:user?.user_metadata.tutorial_library || false,
      tutorial_novel: user?.user_metadata.tutorial_novel || false,
      tutorial_page: user?.user_metadata.tutorial_page || false
    };

    return json({ user: userData, env: { SUPABASE_URL: env.SUPABASE_URL,
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
      SUPABASE_IMG_STORAGE: env.SUPABASE_IMG_STORAGE } }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(null, { headers });
  }
}
