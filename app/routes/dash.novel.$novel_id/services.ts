/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashNovelIdLoader(data: LoaderFunctionArgs) {
  const { request, params } = data;
  const { supabaseClient, headers } = await initServer(request);
  const novel_id = params.novel_id;

  try {
    const novel = await supabaseClient
      .from('novels')
      .select('*, owner:profiles!owner(color, username, avatar, id), members:novel_members!id(*))')
      .match({ id: novel_id })
      .single();
    if (novel.error) throw novel.error;

    const pages = await supabaseClient
      .from('pages')
      .select(
        '*, owner: profiles!owner(color, username, avatar, id), members: page_members(profiles!page_members_user_id_fkey(color, username, avatar, id))'
      )
      .match({ novel_id: novel_id })
      .order('created_at', { ascending: true });
    if (pages.error) throw pages.error;

    return json({ novel: novel.data, pages: pages.data }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in novel id services');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}

export async function DashNovelIdAction({ request, params }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const page_id = data.get('selected_page');
  const page_title = data.get('page_title');
  const page_password = data.get('page_password');
  const isPrivate = data.get('page_private');

  const response = await supabaseClient.auth.getUser();
  const user = response.data?.user;
  const novel_id = params.novel_id;

  if (!user) return redirect('/', { headers });
  try {
    if (request.method === 'POST' && page_id) {
      const update = await supabaseClient
        .from('page_members')
        .insert({
          user_id: user.id,
          page_id
        })
        .select()
        .single();
      if (update.error) throw update.error;
      return redirect('/dash/page/' + page_id, { headers });
    } else if (request.method === 'PUT' && page_title) {
      const page_insert = await supabaseClient
        .from('pages')
        .insert({
          novel_id,
          owner: user.id,
          reference_title: page_title,
          private: Boolean(isPrivate)
        })
        .select()
        .single();
      if (page_insert.error) throw page_insert.error;
      const privateDetails = await supabaseClient
        .from('page_private_details')
        .insert({ page_id: page_insert.data.id, owner_id: user.id, password: page_password })
        .select()
        .single();
      if (privateDetails.error) throw privateDetails.error;
      return json(page_insert, { headers });
    } else return json(null, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in novel id services');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
