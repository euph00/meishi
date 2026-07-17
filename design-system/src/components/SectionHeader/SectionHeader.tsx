import type { CSSProperties } from 'react';
import { Star } from '../Star/Star';
import { LabelMono } from '../LabelMono/LabelMono';
import { Rule } from '../Rule/Rule';
import './SectionHeader.css';

export interface SectionHeaderProps {
  /** The mono eyebrow label, e.g. "Illustrations". */
  label: string;
  /** Optional Japanese tag rendered at the far right, e.g. "近作". */
  jp?: string;
  /** Draw the connecting rule in on mount. */
  draw?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The eyebrow that opens each "Act": a spinning badge star, a mono label, a
 * rule that fills the row, and an optional Japanese tag.
 */
export function SectionHeader({ label, jp, draw = false, className, style }: SectionHeaderProps) {
  return (
    <div className={['euph-section-header', className ?? ''].filter(Boolean).join(' ')} style={style}>
      <Star variant="badge" size={14} spin />
      <LabelMono>{label}</LabelMono>
      <Rule tone="ink" draw={draw} className="euph-section-header__rule" />
      {jp ? (
        <span className="euph-section-header__jp" lang="ja">
          {jp}
        </span>
      ) : null}
    </div>
  );
}
