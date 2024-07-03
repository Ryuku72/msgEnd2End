import { useOutletContext } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { DashOutletContext } from '~/routes/dash/route';
import { BasicProfile } from '~/types';

export type CornerAlertProps = {
  ownerDetails: BasicProfile;
  ownerIsPresent: boolean;
  init: boolean;
};

export function CornerAlert({ ownerDetails, ownerIsPresent = true, init }: CornerAlertProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const { img_url } = useOutletContext<DashOutletContext>();
  const [showPortal, setShowPoral] = useState(false);
  const firstTrigger = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const modal = modalRef?.current;
    return () => {
      if (modal?.open) modal.close();
    };
  }, []);

  useEffect(() => {
    if (!ownerDetails) return;
    if (ownerIsPresent) {
      setShowPoral(true);
      firstTrigger.current = true;
      timerRef.current = setTimeout(() => setShowPoral(false), 6500);
    } else if (firstTrigger.current === true) {
      setShowPoral(true);
      timerRef.current = setTimeout(() => setShowPoral(false), 6500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ownerIsPresent, ownerDetails]);


  const Element = () => {
    if (!init) return null;
    else
      return createPortal(
        <button type="button"
          className={`max-w-[365px] fixed top-4 right-4 bg-white bg-opacity-65 backdrop-blur-sm rounded py-3 pl-3 pr-5 transition-transform duration-1000 ase-in-out ${showPortal ? '-translate-x-2' : 'translate-x-[300px]'} text-left`}
          onClick={() => {
            setShowPoral(false);
            if (timerRef.current) clearTimeout(timerRef.current);
          }}>
          <div className="text-grey-700 text-sm px-2 py-1 rounded-lg flex gap-2 flex-wrap items-center text-gray-700 relative">
            <img
              src={ownerDetails?.avatar ? img_url + ownerDetails?.avatar : Default_Avatar}
              className="rounded-full w-[35px] h-[35px]"
              alt="user-avatar"
              onError={e => {
                e.currentTarget.src = Default_Avatar;
                e.currentTarget.onerror = null;
                return e;
              }}
            />
            <div>
              <p className="truncate text-base text-gray-700 font-semibold">{ownerDetails?.username} (Owner)</p>
              <p className={`text-xs ${ownerIsPresent ? 'text-green-700' : 'text-orange-700'} font-semibold`}>{ownerIsPresent ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </button>,
        document.body
      );
  };

  return Element();
}
