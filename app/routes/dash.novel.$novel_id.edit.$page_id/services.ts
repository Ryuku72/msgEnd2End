/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { isRouteErrorResponse, json, redirect } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashPageIdEditLoader(data: LoaderFunctionArgs) {
  const { request, params } = data;
  const { supabaseClient, headers } = await initServer(request);
  const page_id = params.page_id;

  try {
    const userDetails = await supabaseClient.auth.getUser();
    if (userDetails.error) return redirect('/');
    const response = await supabaseClient.from('pages').select('*').match({ id: page_id }).single();
    if (response.error) throw response.error;
    if (response.data.owner !== userDetails.data.user.id) return redirect('/dash');
    const pageDetails = await supabaseClient.from('page_private_details').select().match({ page_id }).single();
    if (pageDetails.error) throw pageDetails.error;
    return json({ details: pageDetails.data, page: response.data }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in novel id services');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return null;
  }
}

export async function DashPageIdEditAction({ request, params }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    if (request.method === 'DELETE') {
      const update = await supabaseClient.from('pages').delete().match({ id: params.page_id }).select();
      if (update.error) {
        console.dir({ updateError: update });
        throw update.error;
      }
      return redirect(`/dash/novel/${params.novel_id}`, { headers });
    } else if (request.method === 'POST') {
      const data = await request.formData();
      const reference_title = data.get('page_title');
      const password = data.get('page_password');
      const isPrivate = data.get('page_isPrivate');
      const enable_collab = data.get('page_enable_collab');

      console.dir({ reference_title, password, isPrivate, enable_collab });

      const response = await supabaseClient
        .from('pages')
        .update({ reference_title, private: isPrivate  === 'true', enable_collab: enable_collab === 'true' })
        .match({ id: params.page_id })
        .select()
        .single();
      console.log(response);
      if (response.error) {
        console.dir({ responseError: response });
        throw response.error;
      }
      const detailsResponse = await supabaseClient
        .from('page_private_details')
        .update({ password })
        .match({ page_id: params.page_id })
        .select()
        .single();
      if (detailsResponse.error) {
        console.dir({ detailsError: detailsResponse });
        throw detailsResponse.error;
      }
      return redirect(`/dash/novel/${params.novel_id}`, { headers });
    } else return null;
  } catch (error) {
    console.error(error);
    console.error('process error in novel id update services');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
