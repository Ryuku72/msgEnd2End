/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function LoginAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const email = body.get('user-email') as string;
  const password = body.get('user-password') as string;
  try {
    const response = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (response.error) {
      console.error(response.error);
      console.error('error in login');
      return json({ error: { message: response.error?.message } }, { headers });
    }
    return redirect('/dash', { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in login');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}

export async function LoginLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    if (user?.id) return redirect('/dash', { headers });
    return json(null, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in login');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
