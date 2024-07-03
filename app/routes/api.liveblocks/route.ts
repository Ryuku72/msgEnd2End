/* eslint-disable no-console */
import { ActionFunctionArgs, redirect } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { initServer } from '~/services/API';

import { userColor } from '~/helpers/UserColor';

export function loader() {
  return redirect('/');
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const { supabaseClient, headers, env } = await initServer(request);
    const userData = await supabaseClient.auth.getUser();
    const user = userData.data?.user;
    if (!user?.id) return null;
    const avatarURL = user?.user_metadata?.avatar || '';
    const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        avatar: avatarURL ? env.SUPABASE_IMG_STORAGE + 'public/avatars/' + avatarURL : '',
        name: user?.user_metadata.username,
        color: userColor(user?.user_metadata.color),
        userId: user.id
      }
    });

    const { room } = await request.json();
    session.allow(room, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await session.authorize();

    return new Response(body, { headers, status });
  } else return null;
}
