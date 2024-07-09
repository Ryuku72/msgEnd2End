/* eslint-disable no-console */
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  const data = await request.formData();
  const last_logout = data.get('last_logout');

  const authUser = await supabaseClient.auth.getUser();
  if (!authUser.data.user) return redirect('/' , { headers });
  try {
    const response = await supabaseClient.auth.updateUser({ data: { last_logout }});
    if (response.error) {
      console.error('error logging out');
      console.error(response.error);
      return json({ error: { message: response.error.message } }, { headers });
    }

    await supabaseClient.auth.signOut();
    return redirect('/', { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');

    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(null, { headers });
  }
}
