/* eslint-disable no-console */
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initAuthServer } from '~/services/API';
import { AuthProfileEntry } from '~/types';

export async function CreateAction(request: ActionFunctionArgs['request']) {
  const data = await request.formData();
  const email = data.get('email') as string;
  const password = data.get('password') as string;
  const avatar = data.get('avatar') as File;
  const username = data.get('username') as string;
  const color = data.get('color') as string;

  const filename = avatar?.name;
  const imageFilePath = `public/${new Date().valueOf()}_${filename}`;

  const { supabaseClient, headers } = await initAuthServer(request);
  try {
      const response = await supabaseClient.auth.signUp({ email, password, options: { data: {
        avatar: filename ? imageFilePath : null,
        username,
        color,
        tutorial_library: false,
        tutorial_novel: false,
        tutorial_page: false
      } satisfies AuthProfileEntry['user_metadata']}} );

      if (response.error) {
        console.error('create user');
        console.error(response.error);
        return json({ error: { message: response.error.message } }, { headers });
      }

      if (filename) {
        const image = await supabaseClient.storage.from('avatars').upload(imageFilePath, avatar);
        if (image.error) {
          console.error(image.error);
          console.error('image storage');
          return json({ error: { message: image.error.message } }, { headers });
        }
      }

      return redirect('/dash', { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in create');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
