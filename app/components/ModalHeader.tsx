import CloseIcon from '~/svg/CloseIcon/CloseIcon';

export type ModalHeaderProps = {
  title: string;
  close: () => void;
  invert?: boolean;
  bgOpacity?: string;
};

export function ModalHeader({ title, close, invert = false, bgOpacity = 'bg-opacity-100'}: ModalHeaderProps) {
  return (
    <div
      className={`w-full pt-4 px-6 pb-2 flex rounded-t-[inherit] justify-between items-center ${bgOpacity} ${invert ? 'bg-black bg-opacity-75 text-white' : 'bg-white text-gray-600'}`}>
      <h3 className="font-medium text-xl underline underline-offset-4 capitalize flex items-center gap-3">
        &nbsp;{title}&nbsp;&nbsp;&nbsp;
      </h3>
      <button className="crossButton text-current" type="button" onClick={close}>
        <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
      </button>
    </div>
  );
}
