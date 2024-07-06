/* eslint-disable no-console */
import { ActionFunctionArgs } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { json } from 'react-router';

import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const message = JSON.parse(data.get('message') as string);
  const page_id = data.get('page_id');
  const user_id = data.get('user_id');
  const message_id = data.get('message_id');

  try {
    const response = await supabaseClient.from('chats').update({ message, user_id, page_id }).match({ id: message_id }).select().single();
    if (response.error) throw response.error;
    return json(response.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in chat update');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
