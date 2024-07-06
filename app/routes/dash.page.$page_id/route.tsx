import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, NavLink, useLoaderData, useNavigate, useNavigation, useOutletContext } from '@remix-run/react';

import { useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';
import { BasicProfile, MessageWithUser, Page, SupabaseBroadcast } from '~/types';

import { LiveBlocksRoom } from '~/components/LiveBlocksRoom';
import TitleInput from '~/components/TitleInput';

import { ArrowIcon, PublishIcon } from '~/svg';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashOutletContext } from '../dash/route';
import { PageRichTextEditor } from './components/PageRichTextEditor';
import { DashPageIdAction, DashPageIdLoader } from './services';

export function loader(data: LoaderFunctionArgs) {
  return DashPageIdLoader(data);
}

export function action(data: ActionFunctionArgs) {
  return DashPageIdAction(data);
}

type PageBroadcast = Omit<SupabaseBroadcast, 'new' | 'old'> & { new: Page; old: Page };

export default function DashPageId() {
  const loaderData = useLoaderData<{ page: Page, ownerInfo: BasicProfile, chat: MessageWithUser[] }>();
  const { user, supabase } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(loaderData?.page);
  const [ownerInfo] = useState(loaderData?.ownerInfo);

  const isLoading = ['submitting'].includes(navigationState.state);
  const loadingPagesDash =
    'loading' === navigationState.state && navigationState.location.pathname === `/dash/novel/${pageData?.novel_id}`;

  const LocalStrings: (typeof LOCALES)['dash']['draft'] = LOCALES.dash.draft;
  const [titleValue, setTitleValue] = useState(loaderData?.page.reference_title);

  const userData = {
    userId: user.id,
    username: user.username,
    color: user.color,
    avatar: user?.avatar || null
  };

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
            case 'UPDATE': {
              if (info.new.id !== loaderData?.page.id) return;
              return setPageData({ ...info.new });
            }
            case 'DELETE': {
              const alert = new CustomEvent('alertFromError', {
                detail: 'Page has been removed'
              });
              window.dispatchEvent(alert);
              navigate('/dash');
            }
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, navigate, loaderData?.page.id]);

  useEffect(() => {
    const channel = supabase
      .channel('user location', { config: { presence: { key: user.id }, broadcast: { self: true } } })
      .subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        return channel.track({
          novel_id: loaderData?.page.novel_id,
          page_id: loaderData?.page.id,
          room: 'Pages: ' + loaderData?.page.reference_title,
          user_id: user.id
        });
      });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user, loaderData?.page.id, loaderData?.page.reference_title, loaderData?.page.novel_id]);

  return (
    <div className="w-full h-full flex flex-row relative">
      <div className="flex flex-col md:flex-1 flex-auto items-center w-full md:px-10 px-0 py-12 pt-4 md:pt-12 gap-6">
        <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
        </h1>
        <div className="w-full max-w-[1850px] flex flex-col flex-auto gap-3 text-mono md:pb-0 pb-[120px]">
          <Form
            aria-label="draft-update"
            method="post"
            className="w-full flex flex-col gap-3 text-mono relative bg-white bg-opacity-50 backdrop-blur-sm rounded-b-md rounded-t-md md:px-4 px-2 py-4">
            <TitleInput
              title="Page Reference Title"
              id="page-title"
              value={titleValue}
              placeholder={'Enter Page Reference Title'}
              onChange={setTitleValue}
              disabled={user.id !== pageData.owner}
            />
            <LiveBlocksRoom roomId={pageData?.id} authEndpoint="/api/liveblocks">
              <PageRichTextEditor
                namespace={loaderData?.page.id}
                userData={userData}
                enableCollab={pageData.enable_collab}
                ownerId={pageData.owner}
                ownerInfo={ownerInfo}
                supabase={supabase}
                chat={loaderData?.chat}
              />
            </LiveBlocksRoom>
            <div className="w-full flex items-center gap-3 justify-end pt-3">
              <NavLink
                to={`/dash/novel/${pageData?.novel_id}`}
                className="cancelButton w-button after:content-[attr(data-string)]"
                data-string={loadingPagesDash ? '' : 'Pages'}>
                {loadingPagesDash ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-pages-spinner" />
                ) : (
                  <ArrowIcon uniqueId="settings-back" className="w-6 h-auto rotate-180" />
                )}
              </NavLink>
              <button
                className={
                  pageData?.owner === user.id ? 'confirmButton after:content-[attr(data-string)] w-button' : 'hidden'
                }
                type="submit"
                data-string={isLoading ? '' : 'Publish'}
                disabled={false}>
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <PublishIcon className="w-5 h-auto" uniqueId="publish-pageid" />
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
