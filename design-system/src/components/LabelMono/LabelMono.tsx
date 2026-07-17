import type { CSSProperties, ReactNode } from 'react';
import './LabelMono.css';

export interface LabelMonoProps {
  children: ReactNode;
  /** Element to render. Default `span`. */
  as?: 'span' | 'div' | 'p';
  className?: string;
  style?: CSSProperties;
  /** BCP-47 language tag, e.g. `ja` for Japanese labels. */
  lang?: string;
}

/**
 * The system's micro-label: monospace, wide-tracked, fluid 10–12px.
 * Used for kickers, meta, and section eyebrows. Case is left to the content.
 */
export function LabelMono({ children, as: Tag = 'span', className, style, lang }: LabelMonoProps) {
  return (
    <Tag className={['euph-label-mono', className ?? ''].filter(Boolean).join(' ')} style={style} lang={lang}>
      {children}
    </Tag>
  );
}
