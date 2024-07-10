import { SVG_Component_props } from '~/types';

export default function PlusIcon({ className = '', svgColor = '#FFF', id }: SVG_Component_props) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      id={id}
      viewBox="0 0 14.16 14.161"
      width="14.16"
      height="14.161"
      fill={svgColor}>
      <path
        d="M277.783,1093.813a.305.305,0,0,1-.305-.3v-4.85a.962.962,0,1,0-1.925,0v4.85a.305.305,0,0,1-.305.3H270.4a.963.963,0,1,0,0,1.925h4.849a.3.3,0,0,1,.305.3v4.85a.959.959,0,0,0,.962.963.95.95,0,0,0,.963-.963v-4.85a.3.3,0,0,1,.305-.3h4.849a.95.95,0,0,0,.963-.963.958.958,0,0,0-.963-.963Z"
        transform="translate(-269.436 -1087.696)"
      />
    </svg>
  );
}
