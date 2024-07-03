/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashPageIdLoader({ request, params }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient
      .from('pages')
      .select('*, ownerProfile:profiles!owner(id,avatar,username,color)')
      .match({ id: params.page_id as string })
      .single();

    if (response.error) throw response.error;

    return json({ page: response.data, ownerInfo: response.data.ownerProfile }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash novel id');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return redirect('/dash', { headers });
  }
}

export async function DashPageIdAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const publishedData = formData.get('lexical') as string;
  const reference_title = formData.get('page-title');
  const enable_collab = formData.get('enableCollab');
  const { supabaseClient, headers } = await initServer(request);
  const userData = await supabaseClient.auth.getUser();
  const user = userData.data?.user;

  if (!user?.id) return null;
  try {
    if (enable_collab) {
      const response = await supabaseClient
        .from('pages')
        .update({
          enable_collab
        })
        .match({ id: params.page_id })
        .select()
        .single();
      if (response.error) throw response.error;
      return json(response?.data, { headers });
    } else if (publishedData) {
      const response = await supabaseClient
        .from('pages')
        .update({
          published: JSON.parse(publishedData),
          reference_title
        })
        .match({ id: params.page_id })
        .select()
        .single();

      if (response.error) throw response.error;
      return json(response?.data, { headers });
    } else return json(null, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash novel id');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(error, { headers });
  }
}
