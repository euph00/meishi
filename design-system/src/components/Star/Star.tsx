import type { CSSProperties } from 'react';
import { STAR_PATH, STAR_VIEWBOX } from '../../star-path';
import './Star.css';

export type StarVariant = 'ink' | 'yellow' | 'badge';

export interface StarProps {
  /** Fill/treatment. `badge` = yellow fill with an ink outline. Default `ink`. */
  variant?: StarVariant;
  /** Rendered size in px (square). Default 14. */
  size?: number;
  /** Slow continuous rotation — the idle motion of section-header badge stars. */
  spin?: boolean;
  /** Gentle shimmer loop (scale/opacity/brightness pulse). */
  twinkle?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Accessible label. Omit (default) to mark the star decorative (aria-hidden). */
  title?: string;
}

/**
 * The four-pointed star — the core motif of the EUPH "Stage" system.
 * Used as a separator/bullet (8–14px) and as larger accents.
 */
export function Star({
  variant = 'ink',
  size = 14,
  spin = false,
  twinkle = false,
  className,
  style,
  title,
}: StarProps) {
  const classes = [
    'euph-star',
    `euph-star--${variant}`,
    spin ? 'euph-star--spin' : '',
    twinkle ? 'euph-star--twinkle' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      viewBox={STAR_VIEWBOX}
      width={size}
      height={size}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={STAR_PATH} />
    </svg>
  );
}
