import type { CSSProperties } from 'react';
import { Star } from '../Star/Star';
import './PostRow.css';

export interface PostRowProps {
  /** Publish date string, e.g. "2026.07.13". */
  date: string;
  /** Short category tag, e.g. "ESSAY". */
  tag: string;
  title: string;
  /** One-line summary; doubles as the row lede. */
  excerpt: string;
  href: string;
  /** Right-aligned call to action. Default "READ →". */
  readLabel?: string;
  /** Draw the row's top hairline in on mount. */
  draw?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A blog index row: a mono meta line (date · star · tag), a serif title with a
 * READ affordance, and a one-line excerpt. The whole row is a link; it slides
 * right on hover.
 */
export function PostRow({
  date,
  tag,
  title,
  excerpt,
  href,
  readLabel = 'READ →',
  draw = false,
  className,
  style,
}: PostRowProps) {
  return (
    <a
      className={['euph-post-row', draw ? 'euph-post-row--draw' : '', className ?? ''].filter(Boolean).join(' ')}
      href={href}
      style={style}
    >
      <div className="euph-post-row__meta">
        <span>{date}</span>
        <Star variant="yellow" size={8} twinkle />
        <span>{tag}</span>
      </div>
      <div className="euph-post-row__head">
        <span className="euph-post-row__title">{title}</span>
        <span className="euph-post-row__read">{readLabel}</span>
      </div>
      <p className="euph-post-row__excerpt">{excerpt}</p>
    </a>
  );
}
