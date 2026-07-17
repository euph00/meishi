import type { CSSProperties } from 'react';
import './WorkCard.css';

export interface WorkCardProps {
  /** Piece title (rendered italic serif). */
  title: string;
  /** Caption meta, e.g. "01 — 07.2026". */
  meta: string;
  /** Image URL. The frame takes the image's own aspect ratio. */
  image: string;
  /** Alt text. Defaults to `title`. */
  alt?: string;
  /** Intrinsic image width/height in px — set both to reserve layout space (no shift on load). */
  width?: number;
  height?: number;
  /** If set, the whole card becomes a link. */
  href?: string;
  /** Treat `href` as external: opens in a new tab and appends a ↗ to the meta. Default true when `href` is set. */
  external?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A framed artwork thumbnail with an italic title and mono meta. Lifts on hover. */
export function WorkCard({
  title,
  meta,
  image,
  alt,
  width,
  height,
  href,
  external = true,
  className,
  style,
}: WorkCardProps) {
  const isExternalLink = Boolean(href) && external;
  const metaText = isExternalLink ? `${meta} ↗` : meta;

  const inner = (
    <>
      <div className="euph-work-card__frame">
        <img src={image} alt={alt ?? title} width={width} height={height} loading="lazy" decoding="async" />
      </div>
      <figcaption className="euph-work-card__caption">
        <span className="euph-work-card__title">{title}</span>
        <span className="euph-work-card__meta">{metaText}</span>
      </figcaption>
    </>
  );

  if (href) {
    return (
      <a
        className={['euph-work-card', className ?? ''].filter(Boolean).join(' ')}
        href={href}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noopener' : undefined}
        style={style}
      >
        <figure className="euph-work-card__fig">{inner}</figure>
      </a>
    );
  }

  return (
    <figure className={['euph-work-card', className ?? ''].filter(Boolean).join(' ')} style={style}>
      {inner}
    </figure>
  );
}
