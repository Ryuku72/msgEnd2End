import { ReactNode } from 'react';

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';

import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

export function LiveBlocksRoom({ children, roomId, authEndpoint }: { children: ReactNode; roomId: string; authEndpoint: string }) {
  return (
    <LiveblocksProvider authEndpoint={authEndpoint}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null
        }}>
        <ClientSideSuspense
          fallback={
            <div className="w-full h-full flexCenter flex-col">
              <LoadingSpinner id="room-loader" className="w-20 h-20" svgColor="#ff9000" />
            </div>
          }>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
