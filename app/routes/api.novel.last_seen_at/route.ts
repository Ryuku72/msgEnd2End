/* eslint-disable no-console */
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { json } from 'react-router';

import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const formData = await request.formData();
  const novel_id = formData.get('novel_id');
  const last_seen_at = formData.get('last_seen_at') as string;
  const previous_seen_at = formData.get('previous_seen_at') as string | undefined;
  const update: { last_seen_at: string; previous_seen_at?: string } = { last_seen_at };
  if (previous_seen_at) update.previous_seen_at = previous_seen_at;

  try {
    const authUser = await supabaseClient.auth.getUser();
    if (!authUser.data.user) return redirect('/', { headers });
    const response = await supabaseClient
      .from('novel_members')
      .update(update)
      .match({ novel_id, user_id: authUser.data.user?.id })
      .select()
      .single();
    if (response.error) throw response.error;

    return json(response.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in chat delete');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
