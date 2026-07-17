import type { CSSProperties, ReactElement } from 'react';
import './Icon.css';

export type IconName = 'x' | 'mail' | 'branch';

export interface IconProps {
  /** Which contact glyph to draw. */
  name: IconName;
  /** Rendered size in px (square). Default 14. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessible label. Omit to mark decorative (aria-hidden). */
  title?: string;
}

// Minimal single-stroke line glyphs on a 0 0 100 100 viewBox, drawn with
// currentColor so they inherit the surrounding link colour.
const GLYPHS: Record<IconName, ReactElement> = {
  x: (
    <path
      d="M28 28 L72 72 M72 28 L28 72"
      fill="none"
      stroke="currentColor"
      strokeWidth={10}
      strokeLinecap="round"
    />
  ),
  mail: (
    <g fill="none" stroke="currentColor" strokeWidth={8} strokeLinejoin="round">
      <rect x={16} y={26} width={68} height={48} rx={7} />
      <path d="M20 32 L50 56 L80 32" />
    </g>
  ),
  branch: (
    <g fill="none" stroke="currentColor" strokeWidth={8} strokeLinecap="round">
      <circle cx={30} cy={25} r={9} />
      <circle cx={30} cy={75} r={9} />
      <circle cx={71} cy={37} r={9} />
      <path d="M30 34 L30 66 M71 46 C71 62 30 52 30 64" />
    </g>
  ),
};

/** Line-drawn contact icons (X / mail / git-branch). Colour follows `currentColor`. */
export function Icon({ name, size = 14, className, style, title }: IconProps) {
  return (
    <svg
      className={['euph-icon', className ?? ''].filter(Boolean).join(' ')}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {GLYPHS[name]}
    </svg>
  );
}
