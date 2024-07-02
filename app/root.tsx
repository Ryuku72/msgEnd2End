import { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';

import LoadingLayer from '~/components/LoadingLayer';
import ThreeJsBackground from '~/components/ThreeJsBackground';
import { ToastAlert } from '~/components/ToastAlert';

import stylesheet from '~/styles/tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png'
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png'
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png'
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico'
  },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'changelog', href: '/CHANGELOG.md' },
  {
    rel: 'mask-icon',
    href: '/safari-pinned-tab.svg',
    color: '#5bbad5'
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: undefined
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Miltonian&display=swap'
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="flex w-full h-full overflow-auto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/message_novel.png" />
        <meta property="og:image:width" content="1400" />
        <meta property="og:image:height" content="836" />
        <Meta />
        <Links />
      </head>
      <body
        className="flex flex-col w-full min-h-full [background:_#bfe3dd] relative">
        <LoadingLayer />
        <ThreeJsBackground />
        {children}
        <ToastAlert />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const handleSceneReady = (event: Event) => {
      if ('detail' in event && event.detail === 100) setSceneReady(true);
    };
    window.addEventListener('scene ready', handleSceneReady, false);

    return () => {
      window.removeEventListener('scene ready', handleSceneReady, false);
    };
  }, []);

  return <Outlet context={{ sceneReady }} />;
}

export function ErrorBoundary() {
  const error = useRouteError() as { message?: string };
  const LocalStrings = LOCALES.error_boundary;

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-3 w-full h-full relative items-center justify-center">
        <div className="p-12 backdrop-blur-sm bg-white bg-opacity-50 rounded">
          <h1 className="text-4xl text-red-700 font-miltonian">
            {error.status} - {error?.statusText || LocalStrings.unknown_error}
          </h1>
          <p className="text-xl text-gray-600">{error.data}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full h-full relative items-center justify-center">
      <div className="p-12 backdrop-blur-sm bg-white bg-opacity-50 rounded">
        <h1 className="text-4xl text-red-700 font-miltonian">{LocalStrings.unknown_error}</h1>
        <p className="text-xl text-gray-600">{error?.message ?? 'Unknown error'}</p>
      </div>
    </div>
  );
}
