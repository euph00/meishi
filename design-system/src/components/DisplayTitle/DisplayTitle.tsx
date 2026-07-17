import type { CSSProperties, ReactNode } from 'react';
import './DisplayTitle.css';

export interface DisplayTitleProps {
  /**
   * Title content. Wrap the emphasised word in `<em>` — it renders italic and
   * receives the yellow paint-and-depart swipe, e.g.
   * `<DisplayTitle>Recent <em>Work</em></DisplayTitle>`.
   */
  children: ReactNode;
  /** Heading level to render. Default `h2`. */
  as?: 'h1' | 'h2' | 'h3';
  /** Play the yellow swipe over the `<em>` on mount. */
  swipe?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The big editorial section heading. The italic `<em>` word is revealed by a
 * yellow block that paints in from the left, holds, then departs to the right
 * while the word uncovers in lockstep.
 */
export function DisplayTitle({ children, as: Tag = 'h2', swipe = false, className, style }: DisplayTitleProps) {
  return (
    <Tag
      className={['euph-display-title', swipe ? 'euph-display-title--swipe' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </Tag>
  );
}
