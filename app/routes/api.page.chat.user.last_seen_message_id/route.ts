/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initAuthServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initAuthServer(request);
  const data = await request.formData();
  const user_id = data.get('user_id');
  const last_seen_message_id = data.get('last_seen_message_id');
  const page_id = data.get('page_id');

  try {
    const response = await supabaseClient
      .from('page_members')
      .update({ last_seen_message_id })
      .match({ user_id, page_id })
      .select()
      .single();
    if (response.error) throw response.error;
    return json(response.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in page member update');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
