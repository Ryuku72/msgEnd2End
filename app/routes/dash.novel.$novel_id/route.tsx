import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect, useRef, useState } from 'react';

import { CreateDate } from '~/helpers/DateHelper';
import {
  BasicProfile,
  NovelWithUsers,
  OnlineUser,
  Page,
  PageWithUsers,
  Page_Member,
  ProfileEntry,
  SupabaseBroadcast
} from '~/types';

import DialogWrapper from '~/components/DialogWrapper';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { ArrowIcon, PenIcon, PrivateNovelIcon, PublicNovelIcon, TrashIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
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
  const isLoadingUpdate = 'submitting' === navigationState.state;
  const finishedDelete = 'loading' === navigationState.state && navigationState.formMethod === 'DELETE';
  const isLoadingDash = 'loading' === navigationState.state && navigationState.location.pathname === '/dash';
  const submit = useSubmit();

  const [novelPages, setNovelPages] = useState(pages);
  const [onlinePages, setOnlinePages] = useState<string[]>([]);
  const [debouncedOnlinePages, setDebouncedOnlinePages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageWithUsers | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef('');

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
              const pagesData = {
                ...insert.data,
                members: insert.data.members.map((member: { profiles: ProfileEntry }) => member.profiles)
              } as PageWithUsers;
              return setNovelPages(pages => [...pages, pagesData]);
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
              if (page.id === info.new.page_id) return { ...page, members: page.members.concat(thisUser) };
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

  useEffect(() => {
    if (finishedDelete) setSelectedPage(null);
  }, [finishedDelete]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:pt-12 pt-4 md:pb-12 pb-[120px] gap-6">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{novel.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-wide">
        {novelPages.map(page => (
          <div
            className="w-full max-w-wide rounded-lg flex flex-col gap-1 bg-white bg-opacity-35 backdrop-blur-lg p-8 text-gray-700 drop-shadow-lg relative"
            key={page.id}>
            <div
              className={
                onlinePages.some(page_id => page_id === page.id)
                  ? 'absolute top-3 right-4 flex gap-2 items-center z-50'
                  : 'hidden'
              }>
              <p className="text-current text-sm font-semibold">Active</p>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
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
                  {CreateDate(novel.updated_at)}{' '}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-current text-sm text-left">Participants:</p>
              <div className="flex gap-2 text-blue-800 items-center text-sm w-full flex-wrap">
                {page.members.map(user => (
                  <div
                    key={user.id}
                    className={`text-grey-700 text-sm ${user.color} pl-1 pr-2 py-1 rounded flex gap-1 items-center text-gray-700`}>
                    <img
                      src={user.avatar ? img_url + user.avatar : Default_Avatar}
                      className="rounded-full w-4 h-4"
                      alt="user-avatar"
                      onError={e => {
                        e.currentTarget.src = Default_Avatar;
                        e.currentTarget.onerror = null;
                        return e;
                      }}
                    />
                    {user.username}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden h-[115px] relative text-sm">
              <DescriptionPreview editorState={page.published} />
            </div>
            <div className="w-full flex gap-3 flex-wrap mt-2 justify-end">
              <button
                disabled={isLoadingUpdate}
                onClick={() => setSelectedPage(page)}
                className={
                  novel.owner.id === user.id ? 'deleteButton md:w-button w-icon md:after:content-["Delete"]' : 'hidden'
                }>
                <TrashIcon uniqueId="delete-page" svgColor="#fff" className="w-5 h-auto" />
              </button>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData();
                  formData.append('enable_collab', (!page.enable_collab).toString());
                  formData.append('page_id', page.id);
                  submit(formData, { method: 'POST', action: '/api/page/enable_collab', navigate: false });
                }}>
                <button
                  name="enable_collab"
                  value={page.enable_collab ? 'Collab' : 'Solo'}
                  disabled={page.owner.id !== user.id}
                  title={`Owner has ${page.enable_collab ? 'enabled collabaration' : 'disabled collabaration'} `}
                  className="altButton md:w-button w-icon font-semibold md:after:content-[attr(value)]">
                  {page.enable_collab ? (
                    <PublicNovelIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
                  ) : (
                    <PrivateNovelIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
                  )}
                </button>
              </Form>
              <Form method="POST" className={!page.members.some(member => member.id === user.id) ? 'flex' : 'hidden'}>
                <button
                  value={page.id}
                  name="selected_page"
                  disabled={isLoadingUpdate}
                  data-string={
                    navigationState.state === 'loading' && navigationState.location.pathname === `/dash/page/${page.id}`
                      ? ''
                      : 'Participate?'
                  }
                  className="confirmButton font-semibold md:w-wide-button w-icon md:after:content-[attr(data-string)]">
                  {navigationState.state === 'loading' &&
                  navigationState.location.pathname === `/dash/page/${page.id}` ? (
                    <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="page-spinner" />
                  ) : (
                    <PenIcon uniqueId="public-novel-icon" className="w-5 h-auto" />
                  )}
                </button>
              </Form>
              <Link
                to={`/dash/page/${page.id}`}
                data-string={
                  navigationState.state === 'loading' && navigationState.location.pathname === `/dash/page/${page.id}`
                    ? ''
                    : 'Continue'
                }
                className={
                  page.members.some(member => member.id === user.id)
                    ? 'confirmButton font-semibold md:w-button w-icon md:after:content-[attr(data-string)]'
                    : 'hidden'
                }>
                {navigationState.state === 'loading' &&
                navigationState.location.pathname === `/dash/page/${page.id}` ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="page-spinner" />
                ) : (
                  <PenIcon uniqueId="public-novel-icon" className="w-5 h-auto" />
                )}
              </Link>
            </div>
          </div>
        ))}
        <Form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('page_index', (pages?.length + 1).toString() || '0');
            formData.append('novel_owner', novel.owner.id);
            formData.append('updated_at', new Date().toISOString());
            submit(formData, { method: 'put' });
          }}>
          <button
            type="submit"
            name="add_page"
            className={
              user.id === novel.owner.id
                ? 'w-full max-w-wide h-[180px] rounded-lg bg-slate-400 bg-opacity-25 backdrop-blur-lg items-center drop-shadow-lg'
                : 'hidden'
            }>
            <div className="truncate max-w-full p-8 overflow-hidden flex flex-wrap gap-3 text-gray-700">
              <PlusIcon uniqueId="add_another_page" svgColor="currentColor" className="w-5 h-auto " />{' '}
              <p className="text-xl font-semibold">Add Another Page</p>
            </div>
          </button>
        </Form>
      </div>
      <div className="flex w-full max-w-wide justify-center sticky md:bottom-4 bottom-[100px]">
        <Link
          to="/dash"
          data-string={isLoadingDash ? '' : 'Back'}
          className="cancelButton after:content-[attr(data-string)] w-button"
          type="button">
          {isLoadingDash ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="back-dash-spinner" />
          ) : (
            <ArrowIcon uniqueId="settings-back" className="w-6 h-auto rotate-180" />
          )}
        </Link>
      </div>
      <DialogWrapper open={Boolean(selectedPage)}>
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col rounded-t-lg rounded-b-md self-center w-full max-w-card-l">
          <div className="w-full pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center bg-white">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
              &#8197;Confirm Delete&nbsp;&nbsp;&nbsp;
            </h3>
            <button className="crossButton" type="button" onClick={() => setSelectedPage(null)}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full flex flex-col py-8 px-4 bg-white text-gray-700 mt-0.5 gap-2">
            <p>Are you sure you would like to delete the following page?</p>
            <strong className="capitalize">{'"' + selectedPage?.reference_title + '"'}</strong>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
            <Form method="delete">
              <button
                title="delete page"
                value={selectedPage?.id}
                name="page_id_delete"
                data-string={isLoadingUpdate ? '' : 'Delete'}
                className="deleteButton md:after:content-[attr(data-string)] md:w-button w-icon">
                {isLoadingUpdate ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <TrashIcon uniqueId="delete-page" svgColor="#fff" className="w-5 h-auto" />
                )}
              </button>
            </Form>
            <button
              type="button"
              onClick={() => setSelectedPage(null)}
              data-string="Back"
              className="confirmButton md:after:content-[attr(data-string)] md:w-button w-icon">
              <ArrowIcon uniqueId="settings-delete-back" className="w-6 h-auto rotate-180" />
            </button>
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
}
