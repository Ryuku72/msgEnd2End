import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useNavigation, useOutletContext } from '@remix-run/react';

import { useEffect, useRef, useState } from 'react';

import { OnlineUser, ProfileEntry, SupabaseBroadcast } from '~/types';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { ArrowIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashOutletContext } from '../dash/route';
import { UserLoader } from './services';

export function loader({ request }: LoaderFunctionArgs) {
  return UserLoader(request);
}

export type UserChangesBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: ProfileEntry; old: ProfileEntry };

export default function DashUsers() {
  const profiles = useLoaderData<ProfileEntry[]>();
  const { supabase, img_url, user } = useOutletContext<DashOutletContext>();
  const { state } = useLocation();
  const navigationState = useNavigation();
  const navigate = useNavigate();

  const [userProfiles, setUserProfiles] = useState<ProfileEntry[]>(profiles);
  const [onlineUsers, setOnlineUsers] = useState<{ user_id: string; room: string }[]>([]);
  const [debouncedOnlineUsers, setDebouncedOnlineUsers] = useState<{ user_id: string; room: string }[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef('');

  const loadingDash = 'loading' === navigationState.state && navigationState.location.pathname === '/dash';

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        payload => {
          const info = payload as unknown as UserChangesBroadcast;
          switch (payload.eventType) {
            case 'INSERT':
              return setUserProfiles(profiles => [...profiles, info.new]);
            case 'UPDATE':
              return setUserProfiles(profiles =>
                profiles.map(user => {
                  if (user.id === info.new.id) return info.new;
                  else return user;
                })
              );
            case 'DELETE':
              return setUserProfiles(profiles => profiles.filter(user => user.id !== info.old.id));
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel('user location', { config: { presence: { key: user.id }, broadcast: { self: true } } })
      .on('presence', { event: 'sync' }, () => {
        /** Get the presence state from the channel, keyed by realtime identifier */
        const presenceState = channel.presenceState();
        /** transform the presence */
        const online = Object.keys(presenceState)
          .map(presenceId => {
            const presences = presenceState[presenceId] as unknown as OnlineUser[];
            return presences.map(presence => ({ user_id: presence.user_id, room: presence.room }));
          })
          .flat();
        /** sort and set the users */
        if (!lastUpdate.current) setOnlineUsers(online);
        setDebouncedOnlineUsers(online);
      })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        return channel.track({ novel_id: '', page_id: '', room: 'Room: Participants', user_id: user.id });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user]);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      lastUpdate.current = new Date().toString();
      setOnlineUsers(debouncedOnlineUsers);
    }, 1500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [debouncedOnlineUsers]);

  return (
    <div className="flex flex-col flex-auto items-center w-full md:px-10 px-3 md:pt-12 md:pb-12 pb-[200px] pt-4 gap-10">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;Participants&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid lg:grid-cols-[repeat(auto-fill,420px)] grid-cols-[repeat(auto-fill,100%)] justify-center gap-4 w-wide">
        {userProfiles?.map(profile => {
          const online = onlineUsers.find(user => user.user_id === profile?.id);
          return (
            <div
              key={profile.id}
              className={`flex w-full px-4 py-6 overflow-hidden relative rounded-lg font-mono gap-5 h-[155px] text-white items-center ${online ? profile.color : 'bg-gray-400'} bg-opacity-65 backdrop-blur-lg`}>
              <img
                alt="create-img"
                className="w-20 h-20 relative z-10 rounded-full object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
                src={img_url + profile?.avatar || Default_Avatar}
                onError={e => {
                  e.currentTarget.src = Default_Avatar;
                  e.currentTarget.onerror = null;
                  return e;
                }}
              />
              <div className="relative flex flex-col z-10 flex-auto">
                <h3 className="text-current text-2xl font-semibold tracking-wide truncate max-w-full overflow-hidden capitalize">
                  {profile.username}
                </h3>
                <p className="text-current italic font-semibold tracking-wide max-w-full capitalize w-full items-center line-clamp-2">
                  {!online ? 'Away from Keyboard' : online?.room}
                </p>
                <p
                  className={`${online ? 'text-emerald-600 font-semibold' : 'text-slate-700'} text-sm font-semibold tracking-wide overflow-hidden`}>
                  {online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        data-string={loadingDash ? '' : 'Back'}
        onClick={() => {
          state && (state?.novel_id ||  state?.page_id) ? navigate(-1) : navigate('/dash');
        }}
        className="cancelButton md:w-wide-button md:after:content-[attr(data-string)] w-icon">
        {loadingDash ? (
          <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="dash-spinner" />
        ) : (
          <ArrowIcon uniqueId="settings-back" className="w-6 h-auto rotate-180" />
        )}
      </button>
    </div>
  );
}
