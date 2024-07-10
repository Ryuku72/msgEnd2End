import { SVG_Component_props } from '~/types';

export default function LoadingSpinner({ className = '', svgColor = '#FFF', id }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className={className}>
      <radialGradient id={id} cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
        <stop offset="0" stopColor={svgColor} stopOpacity="0"></stop>
        <stop offset=".25" stopColor={svgColor} stopOpacity=".25"></stop>
        <stop offset=".5" stopColor={svgColor} stopOpacity=".5"></stop>
        <stop offset=".75" stopColor={svgColor} stopOpacity=".75"></stop>
        <stop offset="1" stopColor={svgColor}></stop>
      </radialGradient>
      <circle
        // eslint-disable-next-line react/no-unknown-property
        transform-origin="center"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70">
        <animateTransform
          fill="freeze"
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="1.2"
          values="0;360"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"></animateTransform>
      </circle>
      <circle
        // eslint-disable-next-line react/no-unknown-property
        transform-origin="center"
        fill="none"
        opacity=".2"
        stroke={svgColor}
        strokeWidth="15"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"></circle>
    </svg>
  );
}
