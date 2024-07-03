import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation, useOutletContext } from '@remix-run/react';

import { Fragment, useEffect, useRef, useState } from 'react';

import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';
import { Novel, NovelWithMemberIds, Novel_Member, OnlineUser, SupabaseBroadcast } from '~/types';

import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { DashOutletContext } from '../dash/route';
import { DescriptionModel } from './components/DescriptionModel';
import { DashIndexAction, DashIndexLoader } from './service';

export function loader({ request }: LoaderFunctionArgs) {
  return DashIndexLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return DashIndexAction(request);
}

type NovelBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Novel; old: Novel };
type NovelMemberBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Novel_Member; old: Novel_Member };

export default function DashIndex() {
  const library = (useLoaderData() as NovelWithMemberIds[]) || [];
  const { user, supabase } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);

  const [LibraryNovels, setLibraryNovels] = useState(library);
  const [selectedNovel, setSelectedNovel] = useState<NovelWithMemberIds | null>(null);
  const [onlineNovels, setOnlineNovels] = useState<string[]>([]);
  const [debouncedOnlineNovels, setDebouncedOnlineNovels] = useState<string[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef('');

  const LocalStrings = LOCALES.dash;

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
            return presences.map(presence => presence.novel_id);
          })
          .flat();
        /** sort and set the users */
        if (!lastUpdate.current) setOnlineNovels(online);
        setDebouncedOnlineNovels(online);
      })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        channel.track({ novel_id: '', page_id: '', room: 'Room: Libray', user: user });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'novels'
        },
        async payload => {
          const info = payload as unknown as NovelBroadcast;
          switch (payload.eventType) {
            case 'INSERT': {
              const insert = await supabase
                .from('novels')
                .select('*, owner:profiles!owner(color, username, avatar, id), members:novel_members!id(user_id))')
                .match({ id: payload.new.id })
                .single();
              if (insert.error) return;
              return setLibraryNovels(novels => [...novels, insert.data as unknown as NovelWithMemberIds]);
            }
            case 'UPDATE':
              return setLibraryNovels(novels =>
                novels.map(novel => {
                  if (novel.id === info.new.id) return { ...info.new, owner: novel.owner, members: novel.members };
                  else return novel;
                })
              );
            case 'DELETE':
              return setLibraryNovels(novels => novels.filter(novel => novel.id !== info.old.id));
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('page_member-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'novel_members'
        },
        async payload => {
          const info = payload as unknown as NovelMemberBroadcast;
          if (info.new.user_id === user.id) return;
          return setLibraryNovels(novels =>
            novels.map(novel => {
              if (novel.id === info.new.novel_id)
                return { ...novel, members: novel.members.concat({ user_id: info.new.user_id }) };
              else return novel;
            })
          );
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user.id]);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setOnlineNovels(debouncedOnlineNovels);
      lastUpdate.current = new Date().toString();
    }, 1500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [debouncedOnlineNovels]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:py-12 py-4 gap-6">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <h4 className="text-slate-600 text-2xl tracking-wide mono w-full italic pl-4 max-w-wide">
        Welcome <strong className="capitalize">{user.username}</strong>,
      </h4>
      <div className="grid wide:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full max-w-wide">
        {LibraryNovels.map(novel => (
          <button
            type="button"
            key={novel.id}
            className={`flex text-left bg-gray-400 bg-opacity-50 backdrop-blur-xl p-9 overflow-hidden relative rounded-[25px] font-mono flex-col gap-1 group transition-all duration-500 ease-linear ${selectedNovel && selectedNovel?.id === novel?.id ? 'text-gray-700' : 'md:text-white hover:text-gray-700 text-gray-700'}`}
            onClick={() => setSelectedNovel(novel)}>
            <div
              className={
                onlineNovels.some(novel_id => novel_id === novel.id)
                  ? 'absolute top-3 right-4 flex gap-2 items-center z-50'
                  : 'hidden'
              }>
              <p className="text-current text-sm">Active</p>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div
              className={`absolute top-[-80px] right-[-80px] w-[100px] h-[100px] rounded-full transition-all duration-500 ease-linear group-[:nth-child(10n+1)]:bg-pastel-red group-[:nth-child(10n+2)]:bg-pastel-brown group-[:nth-child(10n+3)]:bg-pastel-orange group-[:nth-child(10n+4)]:bg-pastel-yellow group-[:nth-child(10n+5)]:bg-pastel-indigo group-[:nth-child(10n+6)]:bg-pastel-blue group-[:nth-child(10n+7)]:bg-pastel-green group-[:nth-child(10n+8)]:bg-pastel-emerald group-[:nth-child(10n+9)]:bg-pastel-purple group-[:nth-child(10n+0)]:bg-pastel-black ${selectedNovel && selectedNovel?.id === novel?.id ? 'scale-[16]' : 'group-hover:scale-[16] scale-[16] md:scale-0'}`}
            />
            <h3 className="text-current text-left text-2xl font-semibold tracking-wide mb-1 relative z-10 truncate max-w-full overflow-hidden capitalize">
              {novel.title}
            </h3>
            <h4 className="text-current text-left text-lg md:mb-2 relative z-10 truncate max-w-full overflow-hidden">
              Author:{' '}
              <span
                className={`${selectedNovel && selectedNovel?.id === novel?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                {novel.owner.username}
              </span>
            </h4>
            <div className="flex flex-wrap md:flex-col md:gap-1 gap-3">
              <p className="text-current text-xs relative z-10 text-left">
                Created:{' '}
                <span
                  className={`${selectedNovel && selectedNovel?.id === novel?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                  {CreateDate(novel.created_at)}
                </span>
              </p>
              <p className="text-current text-xs relative z-10 text-left">
                Last updated:{' '}
                <span
                  className={`${selectedNovel && selectedNovel?.id === novel?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                  {CreateDate(novel.updated_at)}{' '}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full max-w-[1850px] p-2 flex md:sticky md:bottom-0 pb-[120px] md:pb-2">
        <Link
          to="/dash/new"
          className="confirmButton px-5">
          {isLoading ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
          ) : (
            <Fragment>
              <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-4 h-auto" />
              Write a New Novel
            </Fragment>
          )}
        </Link>
      </div>
      <DescriptionModel
        selectedNovel={selectedNovel}
        close={() => setSelectedNovel(null)}
        ownerId={selectedNovel?.owner.id || ''}
        members={selectedNovel?.members || []}
        userId={user.id}
      />
    </div>
  );
}
