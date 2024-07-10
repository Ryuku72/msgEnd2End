import { MetaFunction } from '@remix-run/node';
import { Link, useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import { PublicLayout } from '~/components/PublicLayout';

import { ArrowIcon } from '~/svg';

import { LexicalLogo, LiveblocksLogo, VercelLogo } from './assets';
import { BunLogo, BunTextLogo } from './assets/BunLogo/BunLogo';
import GsapLogo from './assets/GsapLogo/GsapLogo';
import ReactLogo from './assets/ReactLogo/ReactLogo';
import RemixLogo from './assets/RemixLogo/RemixLogo';
import SupabaseLogo from './assets/SupabaseLogo/SupabaseLogo';
import TailwindLogo from './assets/TailwindLogo/TailwindLogo';
import ThreeLogo from './assets/ThreeLogo/ThreeLogo';
import ViteLogo from './assets/ViteLogo/ViteLogo';
import YjsLogo from './assets/yjs_logo.png';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function About() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const LocalStrings = LOCALES.about;

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 5
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <PublicLayout>
      <div className="max-w-[1200px] w-full flex items-center flex-col gap-10">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LocalStrings.title}
        </h1>
        <div className="flex flex-col gap-2 bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-sm text-white leading-10 max-w-full">
          <p className="text-white text-xl leading-10">
            <strong className="text-3xl underline pr-2">{LocalStrings.description_title}</strong>
            {' '}{LocalStrings.description}{' '}
            <a
              className="text-xl break-all font-bold hover:text-blue-600 text-blue-500 tracking-wide"
              href={LocalStrings.project_link}>
              {LocalStrings.project_link}
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-sm text-white leading-10 max-w-full">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-current tracking-wide underline mb-4">
            {LocalStrings.technology.title}
          </h2>
          <div className="w-full flex flex-wrap justify-center items-center gap-6 text-current">
            <div className="flex max-w-full h-16 p-2 items-center">
              <ReactLogo svgColor="#00d8ff" id="credit-React" className="w-auto h-full" />
              <p className="text-[2.75rem] ml-2 text-current font-semibold tracking-wide font-mono">React</p>
            </div>
            <RemixLogo id="credit-remix" svgColor="none" className="w-auto max-w-full h-16 p-2" />
            <SupabaseLogo id="credit-supabase" className="w-auto max-w-full h-16 p-2" />
            <LexicalLogo id="lexical-logo" className="w-auto max-w-full h-16 p-2" />
            <TailwindLogo id="credit-twcss" className="w-auto max-w-full h-16 p-2" />
            <div className="flex max-w-full h-16 p-2 items-center">
              <ViteLogo id="credit-Vite" className="w-auto h-full" />
              <p className="text-current text-[2.75rem] ml-2 font-bold tracking-wide">Vite</p>
            </div>
            <img src={YjsLogo} alt="Yjs Logo" className="w-16 h-16 p-2 object-fill" />
            <LiveblocksLogo id="liveblocks-logo" className="w-auto max-w-full h-16 p-2" />
            <div className="flex max-w-full h-16 p-2 items-center">
              <BunLogo id="credit-bun" svgColor="text-gray-600" className="w-auto h-full" />
              <BunTextLogo id="credit-bun-text" className="w-auto h-full" />
            </div>
            <div className="flex max-w-full h-16 p-2 items-end">
              <ThreeLogo id="credit-ThreeJs" svgColor="none" className="w-auto h-full" />
              <p className="text-current text-4xl pl-1 tracking-wide font-mono">three.js</p>
            </div>
            <GsapLogo id="credit-gsap" className="w-auto max-w-full h-16 p-2" />
            <VercelLogo id="credit-vercel" className="w-auto max-w-full h-16 p-2" />
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-black bg-opacity-50 backdrop-blur-sm py-6 md:px-10 px-6 rounded-xl shadow-sm text-white leading-10 w-full">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-current tracking-wide underline mb-4">
            {LocalStrings.background.title}
          </h2>
          <p className="text-2xl text-current font-semibold">{LocalStrings.background.name}</p>
          <p className="text-xl text-current break-all">
            <strong className="font-semibold text-orange-700">{LocalStrings.background.author_title}</strong>
            {LocalStrings.background.author}
          </p>
          <a href={LocalStrings.background.source} className="text-xl text-current break-all max-w-full">
            <strong className="font-semibold text-orange-700">{LocalStrings.background.source_title}</strong>{' '}
            {LocalStrings.background.source}
          </a>
        </div>
        <div className="flex w-full justify-center gap-2 bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-sm text-white leading-10 max-w-full">
          <p className="text-lg">Project</p>
        <Link
          to="/about/logs"
          className="text-lg font-bold hover:text-blue-600 text-blue-500">
        Change Logs
        </Link>
        </div>
        <Link
          to="/"
          className="cancelButton after:content-[attr(data-string)] w-button sticky bottom-6"
          data-string={LocalStrings.primary_button}>
          <ArrowIcon id="about-back" className="w-6 h-auto rotate-180" />
        </Link>
      </div>
    </PublicLayout>
  );
}
