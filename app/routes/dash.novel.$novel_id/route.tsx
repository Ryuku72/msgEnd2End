import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSubmit
} from '@remix-run/react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { CreateDate } from '~/helpers/DateHelper';
import {
  BasicProfile,
  NovelWithUsers,
  OnlineUser,
  Page,
  PageWithUsers,
  Page_Member,
  SupabaseBroadcast
} from '~/types';

import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { ArrowIcon, CollabIcon, PenIcon, PrivateIcon, PublicIcon, SoloIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { DashOutletContext } from '../dash/route';
import { DescriptionPreview } from './components/DescriptionPreview';
import { DashNovelIdAction, DashNovelIdLoader } from './services';

export function loader(request: LoaderFunctionArgs) {
  return DashNovelIdLoader(request);
}

export function action(data: ActionFunctionArgs) {
  return DashNovelIdAction(data);
}

type PageBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Page; old: Page };
type PageMemberBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Page_Member; old: Page_Member };

export default function DashNovelId() {
  const { novel, pages } = useLoaderData() as { pages: PageWithUsers[]; novel: NovelWithUsers };
  const { user, img_url, supabase } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [novelPages, setNovelPages] = useState(pages);
  const [onlinePages, setOnlinePages] = useState<string[]>([]);
  const [debouncedOnlinePages, setDebouncedOnlinePages] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [pagePrivate, setPagePrivate] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef('');
  const hasUpdated = useRef(false);

  const isLoadingUpdate = 'submitting' === navigationState.state;
  const isLoadingDash = 'loading' === navigationState.state && navigationState.location.pathname === '/dash';
  const thisNovelUser = novel.members.find(member => member.user_id === user.id);

  const handleVisit = useCallback(() => {
    const formData = new FormData();
    formData.append('novel_id', novel.id);
    formData.append('last_seen_at', new Date().toISOString());
    if (thisNovelUser?.last_seen_at) formData.append('previous_seen_at', thisNovelUser?.last_seen_at);
    hasUpdated.current = true;
    submit(formData, { method: 'POST', action: '/api/novel/last_seen_at', navigate: false });
  }, [novel.id, submit, thisNovelUser?.last_seen_at]);

  useEffect(() => {
    if (!hasUpdated.current) {
      handleVisit();
    }
  }, [handleVisit]);

  useEffect(() => {
    if (navigationState.formMethod === 'PUT') {
      setPagePrivate(false);
      setPageTitle('');
      setPassword('');
    }
  }, [navigationState.formMethod]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages'
        },
        async payload => {
          const info = payload as unknown as PageBroadcast;
          switch (payload.eventType) {
            case 'INSERT': {
              const insert = await supabase
                .from('pages')
                .select(
                  '*, owner: profiles!owner(color, username, avatar, id), members: page_members(profiles!page_members_user_id_fkey(color, username, avatar, id))'
                )
                .match({ id: payload.new.id })
                .single();
              if (insert.error) return;
              return setNovelPages(pages => [...pages, insert.data]);
            }
            case 'UPDATE':
              return setNovelPages(pages =>
                pages.map(page => {
                  if (page.id === info.new.id) return { ...info.new, owner: page.owner, members: page.members };
                  else return page;
                })
              );
            case 'DELETE':
              return setNovelPages(pages => pages.filter(page => page.id !== info.old.id));
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
          table: 'page_members'
        },
        async payload => {
          const info = payload as unknown as PageMemberBroadcast;
          if (info.new.user_id === user.id || info.new.user_id === novel.owner.id) return;
          const userData = await supabase.from('profiles').select('*').match({ id: info.new.user_id }).single();
          const thisUser: BasicProfile = {
            id: userData.data.id,
            username: userData.data.username,
            color: userData.data.color,
            avatar: userData.data?.avatar || null
          };
          return setNovelPages(p =>
            p.map(page => {
              if (page.id === info.new.page_id)
                return { ...page, members: page.members.concat({ profiles: thisUser }) };
              else return page;
            })
          );
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [novel.owner.id, supabase, user.id]);

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
            return presences.map(presence => presence.page_id);
          })
          .flat();
        /** sort and set the users */
        if (!lastUpdate.current) setOnlinePages(online);
        setDebouncedOnlinePages(online);
      })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        channel.track({ novel_id: novel.id, page_id: '', room: 'Novel: ' + novel.title, user_id: user.id });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user.id, novel.id, novel.title]);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      lastUpdate.current = new Date().toString();
      setOnlinePages(debouncedOnlinePages);
    }, 1500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [debouncedOnlinePages]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:pt-12 pt-4 md:pb-12 pb-[120px] gap-6">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{novel.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-wide">
        {novelPages.map(page => (
          <div
            className="w-full max-w-wide rounded-lg flex flex-col gap-1 bg-white bg-opacity-35 backdrop-blur-md p-8 text-gray-700 drop-shadow-lg relative"
            key={page.id}>
            <div className="absolute top-3 right-4 flex gap-2 z-50">
              <div className={onlinePages.some(page_id => page_id === page.id) ? 'flex items-center gap-2' : 'hidden'}>
                <p className="text-current text-sm">Active</p>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div
                className={
                  (!thisNovelUser?.previous_seen_at || new Date(thisNovelUser?.previous_seen_at) < new Date(page.updated_at)) && !page.members.some(member => member.profiles.id === user.id)
                    ? 'flex items-center gap-2'
                    : 'hidden'
                }>
                <p className="text-current text-sm">New</p>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </div>
            </div>

            <p className="text-current text-left text-xl font-semibold truncate max-w-full overflow-hidden">
              {page.reference_title}
            </p>
            <div className="flex flex-wrap gap-3">
              <p className="text-current text-sm text-left">
                Created:{' '}
                <span className="text-current transition-all duration-500 ease-linear font-semibold tracking-wide">
                  {CreateDate(page.created_at)}
                </span>
              </p>
              <p className="text-current text-sm text-left">
                Last updated:{' '}
                <span className="text-current transition-all duration-500 ease-linear font-semibold tracking-wide">
                  {CreateDate(novel.updated_at)}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-current text-sm text-left">Participants:</p>
              <div className="flex gap-2 text-blue-800 items-center w-full flex-wrap">
                {page.members.map(user => (
                  <div
                    key={user.profiles.id}
                    className={`text-grey-700 font-semibold capitalize ${user.profiles.color} pl-1 pr-2 py-1 rounded flex gap-1.5 items-center text-gray-700`}>
                    <img
                      src={user.profiles.avatar ? img_url + user.profiles.avatar : Default_Avatar}
                      className="rounded-full w-7 h-7"
                      alt="user-avatar"
                      onError={e => {
                        e.currentTarget.src = Default_Avatar;
                        e.currentTarget.onerror = null;
                        return e;
                      }}
                    />
                    {user.profiles.username}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden h-[115px] relative text-sm">
              <DescriptionPreview editorState={page.published} />
            </div>
            <div className="flex flex-row flex-wrap justify-end gap-3 w-full pt-4 pb-2">
              <div
                title={page.private ? 'Private' : 'Public'}
                className="flex gap-2 w-fit rounded-lg font-semibold text-gray-600 border border-gray-600 flex-grow-0 capitalize px-2 py-1 after:content-[attr(title)]">
                {page.private ? (
                  <PrivateIcon className="w-5 h-auto" uniqueId="private-novel-icon" />
                ) : (
                  <PublicIcon className="w-6 h-auto" uniqueId="public-novel-icon" />
                )}
              </div>
              <div
                title={page.enable_collab ? 'Collab' : 'Solo'}
                className="flex gap-2 w-fit rounded-lg font-semibold text-gray-600 border border-gray-600 flex-grow-0 capitalize px-2 py-1 after:content-[attr(title)]">
                {page.enable_collab ? (
                  <CollabIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
                ) : (
                  <SoloIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
                )}
              </div>
            </div>
            <div className="w-full flex gap-3 flex-wrap mt-2 justify-end">
              <button
                disabled={isLoadingUpdate}
                onClick={() => navigate(`/dash/novel/${novel.id}/edit/${page.id}`)}
                data-string="Edit"
                className={
                  novel.owner.id === user.id
                    ? 'editButton md:w-button w-icon md:after:content-[attr(data-string)]'
                    : 'hidden'
                }>
                <PenIcon uniqueId="edit-page" svgColor="#fff" className="w-5 h-auto" />
              </button>
              <Form
                method="POST"
                className={!page.members.some(member => member.profiles.id === user.id) ? 'flex' : 'hidden'}>
                <button
                  value={page.id}
                  name="selected_page"
                  disabled={isLoadingUpdate}
                  data-string={
                    navigationState.state === 'loading' && navigationState.location.pathname === `/dash/page/${page.id}`
                      ? ''
                      : 'Participate?'
                  }
                  className="confirmButton font-semibold md:w-wide-button w-icon md:before:content-[attr(data-string)]">
                  {navigationState.state === 'loading' &&
                  navigationState.location.pathname === `/dash/page/${page.id}` ? (
                    <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="page-spinner" />
                  ) : (
                    <ArrowIcon uniqueId="public-novel-icon" className="w-5 h-auto" />
                  )}
                </button>
              </Form>
              <Link
                to={`/dash/page/${page.id}`}
                data-string={
                  navigationState.state === 'loading' && navigationState.location.pathname === `/dash/page/${page.id}`
                    ? ''
                    : 'Next'
                }
                className={
                  page.members.some(member => member.profiles.id === user.id)
                    ? 'confirmButton font-semibold md:w-button w-icon md:after:content-[attr(data-string)]'
                    : 'hidden'
                }>
                {navigationState.state === 'loading' &&
                navigationState.location.pathname === `/dash/page/${page.id}` ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="page-spinner" />
                ) : (
                  <ArrowIcon uniqueId="public-novel-icon" className="w-5 h-auto" />
                )}
              </Link>
            </div>
          </div>
        ))}
        <Form
          method="PUT"
          className={
            user.id === novel.owner.id
              ? 'w-full max-w-wide rounded-lg bg-white bg-opacity-35 backdrop-blur-md drop-shadow-lg p-8 flex flex-col gap-3'
              : 'hidden'
          }>
          <p className="text-gray-700 text-xl font-semibold w-full">Add New Page</p>
          <div className="w-full flex flex-col max-w-[850px] gap-3">
            <TitleInput
              title="Page Title"
              id="page_title"
              value={pageTitle}
              placeholder="Enter Page Title"
              onChange={setPageTitle}
            />
            <PasswordInput
              title="Page Password when Private"
              id="page_password"
              placeholder="Enter Page Password"
              value={password}
              required={pagePrivate}
              onChange={setPassword}
            />
            <div className="flex gap-3 items-center py-2">
              <p className="text-sm font-medium text-gray-600 w-[100px]">Enable Private</p>
              <button type="button" onClick={() => setPagePrivate(!pagePrivate)} className="flex flex-col">
                <div className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" readOnly={true} checked={pagePrivate} />
                  <div className="peer h-4 w-11 rounded border bg-purple-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-md after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-500 peer-checked:after:translate-x-full peer-focus:ring-purple-300" />
                </div>
              </button>
            </div>
          </div>
          <div className="w-full flex gap-3 justify-end">
            <button
              type="submit"
              name="add_page"
              data-string={navigationState.formMethod === 'PUT' ? '' : 'Add New Page'}
              className="confirmButton font-semibold md:w-wide-button w-icon md:after:content-[attr(data-string)]">
              {navigationState.formMethod === 'PUT' ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="page-spinner" />
              ) : (
                <PlusIcon uniqueId="add_another_page" svgColor="currentColor" className="w-4 h-auto" />
              )}
            </button>
          </div>
        </Form>
      </div>
      <div className="flex w-full max-w-wide justify-center sticky md:bottom-4 bottom-[100px]">
        <Link
          to="/dash"
          data-string={isLoadingDash ? '' : 'Novels'}
          className="cancelButton after:content-[attr(data-string)] w-button"
          type="button">
          {isLoadingDash ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="back-dash-spinner" />
          ) : (
            <ArrowIcon uniqueId="settings-back" className="w-6 h-auto rotate-180" />
          )}
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
