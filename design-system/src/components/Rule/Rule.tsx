import type { CSSProperties } from 'react';
import './Rule.css';

export type RuleTone = 'ink' | 'ink-35' | 'paper-25';
export type RuleOrigin = 'left' | 'center' | 'right';

export interface RuleProps {
  /** Hairline colour. Default `ink` (full-strength, as in the hero). */
  tone?: RuleTone;
  /** Play the "draw-in" animation on mount (scaleX 0 → 1). */
  draw?: boolean;
  /** Growth origin for the draw animation. Default `left`. */
  origin?: RuleOrigin;
  /** Stretch to fill a flex row (`flex: 1`). Default true. Set false for a full-width block rule. */
  flex?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A 1px hairline rule — the system's connective tissue between labels and
 * headings. Optionally draws itself in from an edge (or the centre) on mount.
 */
export function Rule({
  tone = 'ink',
  draw = false,
  origin = 'left',
  flex = true,
  className,
  style,
}: RuleProps) {
  const classes = [
    'euph-rule',
    `euph-rule--${tone}`,
    `euph-rule--origin-${origin}`,
    flex ? 'euph-rule--flex' : '',
    draw ? 'euph-rule--draw' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span aria-hidden="true" className={classes} style={style} />;
}
