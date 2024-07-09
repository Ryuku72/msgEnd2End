/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashIndexLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    if (!user) return redirect('/', { headers });

    const novels = await supabaseClient
      .from('novels')
      .select('*, owner:profiles!owner(color, username, avatar, id), members:novel_members!id(user_id))')
      .order('updated_at', { ascending: false });
    if (novels.error) throw novels.error;
    return json(novels.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(error, { headers });
  }
}

export async function DashIndexAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const novel_id = data.get('selected_novel');
  const password = data.get('access_novel_password');
  const response = await supabaseClient.auth.getUser();
  const user = response.data?.user;

  console.dir({ novel_id, password, user: user?.id });

  if (!user) return redirect('/', { headers });
  try {
    const novel_private = await supabaseClient.from('novel_private_details').select('*').match({ novel_id }).single();
    if (novel_private.error) throw novel_private.error;
    if (novel_private.data.password === password && request.method === 'POST') {
      const update = await supabaseClient
        .from('novel_members')
        .insert({
          user_id: user.id,
          novel_id
        })
        .select()
        .single();
      if (update.error) {
        console.error(update.error);
        console.error('process error in add member');
        return json(null, { headers });
      }

      return redirect('/dash/novel/' + novel_id, { headers });
    } else if (request.method === 'PUT') {
      const update = await supabaseClient
      .from('novel_members')
      .insert({
        user_id: user.id,
        novel_id
      })
      .select()
      .single();
    if (update.error) {
      console.error(update.error);
      console.error('process error in add member');
      return json(null, { headers });
    } else return redirect('/dash/novel/' + novel_id, { headers });
    } 
    
    return json({ error: 'Incorrect Password' }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(error, { headers });
  }
}
