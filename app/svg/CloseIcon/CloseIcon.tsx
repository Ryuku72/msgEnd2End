import { SVG_Component_props } from '~/types';

export default function CloseIcon({ className = '', svgColor = '#ffffffe0', id }: SVG_Component_props) {
  return (
    <svg
      className={className}
      id={id}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill={svgColor}
      preserveAspectRatio="xMidYMid meet">
      <path d="M7.3,8C7.1,8,6.9,7.9,6.8,7.8L0.2,1.2c-0.3-0.3-0.3-0.7,0-1c0.3-0.3,0.7-0.3,1,0l6.5,6.5c0.3,0.3,0.3,0.7,0,1 C7.6,7.9,7.5,8,7.3,8z" />
      <path d="M0.7,8C0.5,8,0.4,7.9,0.2,7.8c-0.3-0.3-0.3-0.7,0-1l6.5-6.5c0.3-0.3,0.7-0.3,1,0c0.3,0.3,0.3,0.7,0,1L1.2,7.8 C1.1,7.9,0.9,8,0.7,8z" />
    </svg>
  );
}
