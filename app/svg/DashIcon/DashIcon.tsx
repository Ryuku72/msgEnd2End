import { SVG_Component_props } from '~/types';

export default function DashIcon({ className = '', svgColor = 'none', id }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      id={id}
      version="1.1"
      viewBox="0 0 256 256"
      xmlSpace="preserve">
      <defs></defs>
      <g
        stroke="none"
        strokeWidth={0}
        strokeDasharray="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        fill="none"
        fillRule="nonzero"
        opacity={1}
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
        <path
          d="M 35.813 54.013 H 4.514 C 2.025 54.013 0 51.987 0 49.498 V 4.514 C 0 2.025 2.025 0 4.514 0 h 31.299 c 2.489 0 4.514 2.025 4.514 4.514 v 44.984 C 40.328 51.987 38.303 54.013 35.813 54.013 z"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          fill={svgColor}
          fillRule="nonzero"
          opacity={1}
          transform="matrix(1 0 0 1 0 0) "
        />
        <path
          d="M 35.813 90 H 4.514 C 2.025 90 0 87.975 0 85.485 V 69.741 c 0 -2.489 2.025 -4.515 4.514 -4.515 h 31.299 c 2.489 0 4.514 2.025 4.514 4.515 v 15.744 C 40.328 87.975 38.303 90 35.813 90 z"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          fill={svgColor}
          fillRule="nonzero"
          opacity={1}
          transform="matrix(1 0 0 1 0 0)"
        />
        <path
          d="M 85.485 90 H 54.187 c -2.489 0 -4.515 -2.025 -4.515 -4.515 V 40.501 c 0 -2.489 2.025 -4.514 4.515 -4.514 h 31.299 c 2.489 0 4.515 2.025 4.515 4.514 v 44.984 C 90 87.975 87.975 90 85.485 90 z"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          fill={svgColor}
          fillRule="nonzero"
          opacity={1}
          transform=" matrix(1 0 0 1 0 0) "
        />
        <path
          d="M 85.485 24.773 H 54.187 c -2.489 0 -4.515 -2.025 -4.515 -4.515 V 4.514 C 49.672 2.025 51.697 0 54.187 0 h 31.299 C 87.975 0 90 2.025 90 4.514 v 15.745 C 90 22.748 87.975 24.773 85.485 24.773 z"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          fill={svgColor}
          fillRule="nonzero"
          opacity={1}
          transform=" matrix(1 0 0 1 0 0)"
        />
      </g>
    </svg>
  );
}
