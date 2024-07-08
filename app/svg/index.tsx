import { SVG_Component_props } from '~/types';

export function ArrowClockwiseIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={svgColor}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    </svg>
  );
}

export function ArrowCounterClockwiseIcon({
  className = '',
  svgColor = 'currentColor',
  uniqueId
}: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
    </svg>
  );
}

export function QuoteIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
      <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
    </svg>
  );
}

export function CheveronDownIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

export function CodeIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
    </svg>
  );
}

export function JustifyIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function LinkIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
      <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
    </svg>
  );
}

export function ListOLIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
      />
      <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
    </svg>
  );
}

export function ListULIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
      />
    </svg>
  );
}

export function PencilFillIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
    </svg>
  );
}

export function CheckListIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
    </svg>
  );
}

export function TextCenterIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextLeftIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextParagraphIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextRightIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TypeBoldIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
    </svg>
  );
}

export function TextH1Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
    </svg>
  );
}

export function TextH2Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
    </svg>
  );
}

export function TextH3Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z" />
    </svg>
  );
}

export function TypeItalicIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
    </svg>
  );
}

export function TypeStrikeThroughIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
    </svg>
  );
}

export function TypeUnderlineIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
    </svg>
  );
}

export function HorizontalRuleIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M0 10.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM12 0H4a2 2 0 0 0-2 2v7h1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7h1V2a2 2 0 0 0-2-2zm2 12h-1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2H2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2z" />
    </svg>
  );
}

export function FileImageIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={svgColor} id={uniqueId} viewBox="0 0 16 16" className={className}>
      <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
    </svg>
  );
}

export function MicIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
      <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
    </svg>
  );
}

export function StickyIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z" />
    </svg>
  );
}

export function SendIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} className={className} id={uniqueId}>
      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
    </svg>
  );
}

export function CommentsIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

export function TrashIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

export function DisconnectIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg fill={svgColor} id={uniqueId} className={className} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"></path>{' '}
      </g>
    </svg>
  );
}

export function ConnectIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      fill={svgColor}
      id={uniqueId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 297 297"
      xmlSpace="preserve">
      <g>
        <path
          d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
		c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
		c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
		c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
		c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
		 M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
		 M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
		c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
		l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"
        />
        <path
          d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
		c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"
        />
        <path
          d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
		c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
		C283.818,58.42,225.405,0.001,153.607,0z"
        />
      </g>
    </svg>
  );
}

export function SoloIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      className={className}
      id={uniqueId}
      fill="none"
      stroke={svgColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function CollabIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      className={className}
      id={uniqueId}
      fill="none"
      stroke={svgColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function SyncIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      id={uniqueId}
      className={className}
      stroke={svgColor}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
      />
    </svg>
  );
}

export function PenIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id={uniqueId} className={className} fill="none">
      <path
        d="M14.8686 4.13134L14.1615 3.42423L14.1615 3.42423L14.8686 4.13134ZM7.81459 7.48152L8.08931 8.44304L7.81459 7.48152ZM5.57564 9.83884L6.55004 10.0637V10.0637L5.57564 9.83884ZM3 21L2.02561 20.7751C1.94808 21.1111 2.04909 21.4633 2.29289 21.7071C2.5367 21.9509 2.8889 22.0519 3.22486 21.9744L3 21ZM14.1611 18.4243L13.9363 17.4499L13.9363 17.4499L14.1611 18.4243ZM16.5185 16.1854L15.5569 15.9107L16.5185 16.1854ZM19.8686 9.13134L20.5757 9.83845V9.83845L19.8686 9.13134ZM19.8686 6.8686L19.1615 7.57571H19.1615L19.8686 6.8686ZM17.1314 4.13134L17.8385 3.42423V3.42423L17.1314 4.13134ZM20.5368 8.30899L19.5858 7.99997L20.5368 8.30899ZM20.5368 7.69095L19.5858 7.99997L20.5368 7.69095ZM15.4404 18.0251L15.9601 18.8794H15.9601L15.4404 18.0251ZM16.0539 17.4424L16.8804 18.0054L16.8804 18.0054L16.0539 17.4424ZM6.55756 7.94607L7.12056 8.77253L7.12056 8.77253L6.55756 7.94607ZM5.97487 8.55957L6.82922 9.07928L6.82922 9.07928L5.97487 8.55957ZM15.691 3.46313L15.382 2.51207L15.691 3.46313ZM16.309 3.46313L16.618 2.51207L16.618 2.51207L16.309 3.46313ZM9.14645 16.2676C9.53697 15.8771 9.53697 15.2439 9.14644 14.8534C8.75591 14.4629 8.12275 14.4629 7.73223 14.8534L9.14645 16.2676ZM10 14.5C10 14.7761 9.77614 15 9.5 15V17C10.8807 17 12 15.8807 12 14.5H10ZM9.5 15C9.22386 15 9 14.7761 9 14.5H7C7 15.8807 8.11929 17 9.5 17V15ZM9 14.5C9 14.2238 9.22386 14 9.5 14V12C8.11929 12 7 13.1193 7 14.5H9ZM9.5 14C9.77614 14 10 14.2238 10 14.5H12C12 13.1193 10.8807 12 9.5 12V14ZM14.1615 3.42423L12.2929 5.29286L13.7071 6.70708L15.5757 4.83845L14.1615 3.42423ZM12.7253 5.03845L7.53987 6.51999L8.08931 8.44304L13.2747 6.96149L12.7253 5.03845ZM4.60125 9.61398L2.02561 20.7751L3.97439 21.2248L6.55004 10.0637L4.60125 9.61398ZM3.22486 21.9744L14.386 19.3987L13.9363 17.4499L2.77514 20.0256L3.22486 21.9744ZM17.48 16.4601L18.9615 11.2747L17.0385 10.7252L15.5569 15.9107L17.48 16.4601ZM18.7071 11.7071L20.5757 9.83845L19.1615 8.42424L17.2929 10.2929L18.7071 11.7071ZM20.5757 6.16149L17.8385 3.42423L16.4243 4.83845L19.1615 7.57571L20.5757 6.16149ZM20.5757 9.83845C20.7621 9.65211 20.9449 9.47038 21.0858 9.30446C21.2342 9.12961 21.3938 8.90772 21.4879 8.618L19.5858 7.99997C19.6057 7.93858 19.6292 7.92986 19.5611 8.01011C19.4854 8.09928 19.3712 8.21456 19.1615 8.42424L20.5757 9.83845ZM19.1615 7.57571C19.3712 7.78538 19.4854 7.90066 19.5611 7.98984C19.6292 8.07008 19.6057 8.06136 19.5858 7.99997L21.4879 7.38194C21.3938 7.09222 21.2342 6.87033 21.0858 6.69548C20.9449 6.52957 20.7621 6.34783 20.5757 6.16149L19.1615 7.57571ZM21.4879 8.618C21.6184 8.21632 21.6184 7.78362 21.4879 7.38194L19.5858 7.99997V7.99997L21.4879 8.618ZM14.386 19.3987C14.988 19.2598 15.5141 19.1507 15.9601 18.8794L14.9207 17.1708C14.8157 17.2346 14.6727 17.28 13.9363 17.4499L14.386 19.3987ZM15.5569 15.9107C15.3493 16.6373 15.2966 16.7778 15.2274 16.8794L16.8804 18.0054C17.1743 17.574 17.3103 17.0541 17.48 16.4601L15.5569 15.9107ZM15.9601 18.8794C16.3257 18.6571 16.6395 18.359 16.8804 18.0054L15.2274 16.8794C15.1471 16.9973 15.0426 17.0966 14.9207 17.1708L15.9601 18.8794ZM7.53987 6.51999C6.94585 6.68971 6.426 6.82571 5.99457 7.11961L7.12056 8.77253C7.22213 8.70334 7.36263 8.65066 8.08931 8.44304L7.53987 6.51999ZM6.55004 10.0637C6.71998 9.32729 6.76535 9.18427 6.82922 9.07928L5.12053 8.03986C4.84922 8.48586 4.74017 9.01202 4.60125 9.61398L6.55004 10.0637ZM5.99457 7.11961C5.64092 7.36052 5.34291 7.67429 5.12053 8.03986L6.82922 9.07928C6.90334 8.95742 7.00268 8.85283 7.12056 8.77253L5.99457 7.11961ZM15.5757 4.83845C15.7854 4.62878 15.9007 4.51459 15.9899 4.43889C16.0701 4.37076 16.0614 4.39424 16 4.41418L15.382 2.51207C15.0922 2.60621 14.8704 2.76578 14.6955 2.91421C14.5296 3.05506 14.3479 3.2379 14.1615 3.42423L15.5757 4.83845ZM17.8385 3.42423C17.6521 3.23789 17.4704 3.05506 17.3045 2.91421C17.1296 2.76578 16.9078 2.60621 16.618 2.51207L16 4.41418C15.9386 4.39424 15.9299 4.37077 16.0101 4.43889C16.0993 4.51459 16.2146 4.62877 16.4243 4.83845L17.8385 3.42423ZM16 4.41418H16L16.618 2.51207C16.2163 2.38156 15.7837 2.38156 15.382 2.51207L16 4.41418ZM12.2929 6.70708L17.2929 11.7071L18.7071 10.2929L13.7071 5.29286L12.2929 6.70708ZM7.73223 14.8534L2.29289 20.2929L3.70711 21.7071L9.14645 16.2676L7.73223 14.8534Z"
        fill={svgColor}
      />
    </svg>
  );
}

export function ArrowIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id={uniqueId} className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M3.76001 7.22005V16.7901C3.76001 18.7501 5.89 19.98 7.59 19L11.74 16.61L15.89 14.21C17.59 13.23 17.59 10.78 15.89 9.80004L11.74 7.40004L7.59 5.01006C5.89 4.03006 3.76001 5.25005 3.76001 7.22005Z"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.24 18.1801V5.82007"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PublishIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      className={className}
      id={uniqueId}
      viewBox="0 0 32 32"
      xmlSpace="preserve">
      <path
        d="M27.914,14.774c-0.044-1.675-0.048-3.353-0.14-5.026c-0.029-0.519-0.054-1.038-0.075-1.555  c-0.021-0.536-0.004-1.076,0.006-1.612c0.021-1.124,0.04-2.246,0.029-3.37c-0.002-0.218-0.091-0.414-0.225-0.569  c-0.038-0.145-0.1-0.282-0.206-0.39C27.172,2.123,26.953,2,26.755,2c-0.019,0-0.037,0.001-0.056,0.003  c-1.618,0.205-3.257,0.14-4.884,0.174c-1.673,0.034-3.345,0.107-5.018,0.14c-0.852,0.017-1.702,0.031-2.554,0.01  c-0.858-0.023-1.71-0.021-2.567,0.021C10.836,2.39,9.995,2.434,9.153,2.461C8.283,2.488,7.414,2.482,6.545,2.488  C6.059,2.49,5.574,2.492,5.088,2.494c-0.442,0.002-0.81,0.368-0.81,0.812c0,0.132,0.042,0.253,0.101,0.366  c0,0.938,0.019,1.881-0.037,2.817c-0.025,0.425-0.061,0.85-0.078,1.275c-0.015,0.417-0.021,0.833-0.029,1.25  c-0.029,1.732,0.002,3.467-0.021,5.2c-0.021,1.719,0.019,3.437,0.015,5.154c-0.004,0.84,0.015,1.683,0,2.525  c-0.017,0.85-0.038,1.702-0.05,2.552c-0.017,1.443-0.144,2.885-0.119,4.329c0.002,0.106,0.029,0.205,0.064,0.301  c-0.004,0.033-0.02,0.062-0.02,0.096c0,0.454,0.371,0.806,0.818,0.817c1.719,0.046,3.437-0.056,5.158-0.083  c0.798-0.011,1.597,0,2.395,0c0.804,0,1.608,0,2.41,0.002c1.675,0.006,3.349,0.004,5.022,0.002c1.566,0,3.134,0.081,4.7,0.065  c0.331-0.004,0.662-0.026,0.992-0.052c0.327-0.026,0.657-0.028,0.984-0.038c0.255-0.007,0.479-0.128,0.635-0.31  c0.235-0.082,0.436-0.259,0.501-0.513c0.1-0.391,0.08-0.819,0.098-1.221c0.013-0.368,0.023-0.737,0.033-1.105  c0.01-0.377,0.034-0.754,0.05-1.129c0.013-0.385,0.013-0.77,0.015-1.155c0.011-1.622,0.021-3.243,0.023-4.865  C27.941,17.983,27.954,16.379,27.914,14.774z M25.5,28.248c-0.286,0.014-0.572,0.019-0.859,0.025  c0.006-0.21,0.017-0.419,0.025-0.628c0.017-0.473,0.011-0.946,0.01-1.419c0-1.005,0.017-2.008,0.019-3.013  c0.002-0.427-0.356-0.781-0.781-0.781c-0.423,0-0.781,0.354-0.779,0.781c0.002,1.005,0.021,2.008,0.01,3.013  c-0.006,0.473-0.013,0.946-0.04,1.419c-0.012,0.217-0.025,0.435-0.033,0.653c-0.325,0.003-0.649,0.011-0.975,0.013  c-1.648,0.01-3.299,0.056-4.947,0.061c-1.648,0.006-3.299,0.02-4.947-0.005c-0.781-0.01-1.564-0.016-2.345-0.016  c-0.789,0-1.576,0.033-2.363,0.035c-0.537,0.002-1.073-0.012-1.609-0.021c0.013-0.689,0.01-1.38,0.039-2.069  c0.019-0.427,0.034-0.854,0.033-1.281c-0.004-0.379-0.01-0.756-0.008-1.135c0.008-1.702,0.021-3.406,0.019-5.108  c-0.002-1.721-0.031-3.442-0.059-5.162c-0.029-1.73-0.046-3.465-0.006-5.194c0.033-1.443,0.11-2.883,0.137-4.325  c1.519-0.034,3.036-0.094,4.553-0.163c0.831-0.039,1.664-0.069,2.495-0.077c0.415-0.002,0.833,0.011,1.25,0.025  c0.415,0.015,0.833,0.029,1.25,0.025c1.708-0.012,3.418-0.021,5.125-0.063c0.711-0.018,1.42-0.027,2.13-0.038  c-0.057,1.449-0.095,2.9-0.142,4.35c-0.048,1.538-0.05,3.077,0.029,4.614c0.033,0.626,0.069,1.252,0.119,1.878  c0.048,0.617,0.071,1.235,0.098,1.854c0.054,1.27,0.059,2.539,0.071,3.81c0.002,0.423,0.35,0.775,0.775,0.775  c0.421,0,0.781-0.352,0.777-0.775c-0.008-0.814-0.055-1.624-0.067-2.436c-0.012-0.798-0.027-1.597-0.054-2.395  c-0.027-0.781-0.103-1.562-0.144-2.343c-0.04-0.749-0.077-1.498-0.082-2.248c-0.008-1.241,0.013-2.481,0.033-3.722  c0.016-1.125,0.074-2.251,0.133-3.375c0.406-0.002,0.812-0.008,1.218-0.025c0.124-0.005,0.248-0.008,0.372-0.011  c0.017,0.742,0.037,1.485,0.032,2.227c-0.002,0.85-0.04,1.702,0.004,2.55c0.046,0.854,0.107,1.706,0.14,2.56  c0.033,0.833,0.038,1.667,0.071,2.5c0.121,3.241,0.119,6.482,0.147,9.726c0.008,0.923,0.015,1.844-0.021,2.765  c-0.017,0.458-0.033,0.917-0.057,1.373c-0.014,0.253-0.03,0.507-0.045,0.761C26,28.224,25.75,28.234,25.5,28.248z M11.41,10.053  c0-0.45,0.375-0.827,0.825-0.825c0.963,0.002,1.926,0.015,2.889,0.023c0.35,0.004,0.701,0.002,1.053-0.002  c0.507-0.002,1.015-0.008,1.522,0.006c0.419,0.009,0.768,0.341,0.768,0.766c0,0.429-0.348,0.754-0.768,0.768  c-0.865,0.026-1.733,0.061-2.6,0.067c-0.953,0.007-1.909,0.021-2.864,0.023C11.785,10.88,11.41,10.502,11.41,10.053z M20.115,12.864  c0,0.205-0.082,0.402-0.226,0.547c-0.155,0.153-0.337,0.21-0.548,0.226c-0.283,0.023-0.571,0.011-0.856,0.017  c-0.331,0.006-0.662,0.014-0.996,0.006c-0.645-0.012-1.29-0.019-1.936-0.021c-1.413-0.01-2.824-0.046-4.237-0.039  c-0.446,0.002-0.818-0.373-0.818-0.817s0.371-0.817,0.818-0.815c0.731,0.002,1.459,0.038,2.19,0.075  c0.689,0.032,1.378,0.048,2.07,0.048c0.251,0,0.504,0,0.756,0.001c0.402,0,0.806,0.002,1.21-0.003c0.28-0.002,0.561,0,0.842,0.002  c0.318,0.003,0.636,0.007,0.955,0C19.762,12.083,20.115,12.448,20.115,12.864z M18.97,15.868c0,0.207-0.084,0.408-0.23,0.555  c-0.134,0.132-0.358,0.249-0.553,0.228c-2.052-0.211-4.116-0.178-6.176-0.168c-0.419,0.001-0.768-0.351-0.768-0.768  c0-0.416,0.347-0.768,0.764-0.768c0.001,0,0.002,0,0.003,0c1.07,0.006,2.141,0.034,3.211,0.04c0.513,0.002,1.028-0.004,1.541,0.023  c0.475,0.025,0.95,0.052,1.424,0.075C18.612,15.108,18.97,15.426,18.97,15.868z"
        fill={svgColor}
      />
    </svg>
  );
}

export function LoginIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} id={uniqueId} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 16C8 18.8284 8 20.2426 8.87868 21.1213C9.51998 21.7626 10.4466 21.9359 12 21.9827M8 8C8 5.17157 8 3.75736 8.87868 2.87868C9.75736 2 11.1716 2 14 2H15C17.8284 2 19.2426 2 20.1213 2.87868C21 3.75736 21 5.17157 21 8V10V14V16C21 18.8284 21 20.2426 20.1213 21.1213C19.3529 21.8897 18.175 21.9862 16 21.9983"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3 9.5V14.5C3 16.857 3 18.0355 3.73223 18.7678C4.46447 19.5 5.64298 19.5 8 19.5M3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 12L15 12M15 12L12.5 14.5M15 12L12.5 9.5"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SubmitIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} id={uniqueId} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10V18C3 19.1046 3.89543 20 5 20H12M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V13"
        stroke={svgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5"
        stroke={svgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="7" r="1" fill={svgColor} />
      <circle cx="9" cy="7" r="1" fill={svgColor} />
    </svg>
  );
}

export function TypeWriterIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      id={uniqueId}
      fill={svgColor}
      viewBox="0 0 512 512"
      xmlSpace="preserve">
      <g>
        <g>
          <circle cx="122.435" cy="361.739" r="16.696" />
        </g>
      </g>
      <g>
        <g>
          <circle cx="189.217" cy="361.739" r="16.696" />
        </g>
      </g>
      <g>
        <g>
          <circle cx="256" cy="361.739" r="16.696" />
        </g>
      </g>
      <g>
        <g>
          <circle cx="322.783" cy="361.739" r="16.696" />
        </g>
      </g>
      <g>
        <g>
          <circle cx="389.565" cy="361.739" r="16.696" />
        </g>
      </g>
      <g>
        <g>
          <path d="M503.943,416.496l-30.899-123.594v-64.729c0-27.618-22.469-50.087-50.087-50.087h-16.696v-33.391h50.087    c9.22,0,16.696-7.475,16.696-16.696V94.609c0-9.22-7.475-16.696-16.696-16.696s-16.696,7.475-16.696,16.696v16.696h-33.391V50.087    C406.261,22.469,383.792,0,356.174,0H155.826c-27.618,0-50.087,22.469-50.087,50.087v61.217H72.348V94.609    c0-9.22-7.475-16.696-16.696-16.696c-9.22,0-16.696,7.475-16.696,16.696V128c0,9.22,7.475,16.696,16.696,16.696h50.087v33.391    H89.044c-27.618,0-50.087,22.469-50.087,50.087v64.729l-30.9,123.595c-1.674,6.703-2.491,13.596-2.491,20.246v25.169    C5.565,489.531,28.034,512,55.652,512h400.696c27.618,0,50.087-22.469,50.087-50.087v-25.169    C506.435,430.237,505.655,423.344,503.943,416.496z M139.13,50.087c0-9.206,7.49-16.696,16.696-16.696h200.348    c9.206,0,16.696,7.49,16.696,16.696v61.217H139.13V50.087z M139.13,144.696H372.87v66.783H139.13V144.696z M72.348,228.174    c0-9.206,7.49-16.696,16.696-16.696h16.696v16.696c0,9.22,7.475,16.696,16.696,16.696h267.13c9.22,0,16.696-7.475,16.696-16.696    v-16.696h16.696c9.206,0,16.696,7.49,16.696,16.696v50.087H72.348V228.174z M68.688,311.652h374.624l25.044,100.174H43.644    L68.688,311.652z M473.043,461.913c0,9.206-7.49,16.696-16.696,16.696H55.652c-9.206,0-16.696-7.49-16.696-16.696v-16.696h434.087    V461.913z" />
        </g>
      </g>
    </svg>
  );
}

export function HelpIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} id={uniqueId} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 9C10 8.60444 10.1173 8.21776 10.3371 7.88886C10.5568 7.55996 10.8692 7.30362 11.2346 7.15224C11.6001 7.00087 12.0022 6.96126 12.3902 7.03843C12.7781 7.1156 13.1345 7.30608 13.4142 7.58579C13.6939 7.86549 13.8844 8.22186 13.9616 8.60982C14.0387 8.99778 13.9991 9.39992 13.8478 9.76537C13.6964 10.1308 13.44 10.4432 13.1111 10.6629C12.7822 10.8827 12.3956 11 12 11V12M14.25 19L12.8 20.9333C12.4 21.4667 11.6 21.4667 11.2 20.9333L9.75 19H7C4.79086 19 3 17.2091 3 15V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V15C21 17.2091 19.2091 19 17 19H14.25Z"
        stroke={svgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="1" fill={svgColor} />
    </svg>
  );
}

export function ChatIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} id={uniqueId} viewBox="0 0 24 24" fill="none">
      <path d="M8 10.5H16" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 14H13.5" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExpandIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={svgColor} id={uniqueId} className={className} viewBox="0 0 24 24">
      <path d="M3,4V20a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H4A1,1,0,0,0,3,4ZM5,5H19V19H10V15a1,1,0,0,0-1-1H5Zm6.293,7.707a1,1,0,0,1,0-1.414L14.086,8.5H13a1,1,0,0,1,0-2h3.5a1.01,1.01,0,0,1,.382.077A1,1,0,0,1,17.5,7.5V11a1,1,0,0,1-2,0V9.914l-2.793,2.793A1,1,0,0,1,11.293,12.707Z" />
    </svg>
  );
}

export function ShrinkIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={svgColor} id={uniqueId} className={className} viewBox="0 0 24 24">
      <path d="M20,21a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1ZM5,5H19V19H10V15a1,1,0,0,0-1-1H5Zm6.077,7.382A1.01,1.01,0,0,1,11,12V8.5a1,1,0,0,1,2,0V9.586l2.793-2.793a1,1,0,1,1,1.414,1.414L14.414,11H15.5a1,1,0,0,1,0,2H12a1.01,1.01,0,0,1-.382-.077A1,1,0,0,1,11.077,12.382Z" />
    </svg>
  );
}

export function UpdateIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id={uniqueId} className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.9844 10H17M20.9844 10V6M20.9844 10L17.6569 6.34315C14.5327 3.21895 9.46734 3.21895 6.34315 6.34315C3.21895 9.46734 3.21895 14.5327 6.34315 17.6569C9.46734 20.781 14.5327 20.781 17.6569 17.6569C18.4407 16.873 19.0279 15.9669 19.4184 15M12 9V13L15 14.5"
        stroke={svgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PrivateIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id={uniqueId} className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z"
        fill={svgColor}
      />
      <path
        d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
        fill={svgColor}
      />
      <path
        d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
        fill={svgColor}
      />
      <path
        d="M6 10V8C6 7.65929 6.0284 7.32521 6.08296 7M18 10V8C18 4.68629 15.3137 2 12 2C10.208 2 8.59942 2.78563 7.5 4.03126"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PublicIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id={uniqueId} className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6.00002V6.75002H18.75V6.00002H18ZM15.7172 2.32614L15.6111 1.58368L15.7172 2.32614ZM4.91959 3.86865L4.81353 3.12619H4.81353L4.91959 3.86865ZM5.07107 6.75002H18V5.25002H5.07107V6.75002ZM18.75 6.00002V4.30604H17.25V6.00002H18.75ZM15.6111 1.58368L4.81353 3.12619L5.02566 4.61111L15.8232 3.0686L15.6111 1.58368ZM4.81353 3.12619C3.91638 3.25435 3.25 4.0227 3.25 4.92895H4.75C4.75 4.76917 4.86749 4.63371 5.02566 4.61111L4.81353 3.12619ZM18.75 4.30604C18.75 2.63253 17.2678 1.34701 15.6111 1.58368L15.8232 3.0686C16.5763 2.96103 17.25 3.54535 17.25 4.30604H18.75ZM5.07107 5.25002C4.89375 5.25002 4.75 5.10627 4.75 4.92895H3.25C3.25 5.9347 4.06532 6.75002 5.07107 6.75002V5.25002Z"
        fill={svgColor}
      />
      <path d="M8 12H16" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 15.5H13.5" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M4 6V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V14M4 6V5M4 6H17C18.6569 6 20 7.34315 20 9V10"
        stroke={svgColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
