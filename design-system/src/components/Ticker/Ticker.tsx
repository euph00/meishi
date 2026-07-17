import type { CSSProperties } from 'react';
import { Star } from '../Star/Star';
import './Ticker.css';

// Hiragana, katakana, or CJK ideographs → Japanese styling + lang="ja".
// Written with \u escapes (not literal CJK) so the bundled source stays pure
// ASCII — a literal character-class range corrupts into an invalid regex if the
// bundle is ever decoded as anything other than UTF-8.
const JP_RE = /[\u3040-\u30FF\u3400-\u9FFF]/;

export interface TickerProps {
  /** Marquee items. Japanese entries are auto-detected and get JP styling. */
  items: string[];
  /** Groups per half-track. The group is tiled this many times on each side of
   * the seamless −50% loop. Raise it if a gap shows on very wide screens. Default 6. */
  groupsPerHalf?: number;
  /** Seconds for one group to travel a screen. Default 16. */
  secondsPerGroup?: number;
  /** Pin to the bottom of a positioned parent (as in the hero). Default false — a static strip. */
  absolute?: boolean;
  className?: string;
  style?: CSSProperties;
}

function Group({ items }: { items: string[] }) {
  return (
    <div className="euph-ticker__group" aria-hidden="true">
      {items.map((text, i) => {
        const jp = JP_RE.test(text);
        return (
          <span key={i} style={{ display: 'contents' }}>
            {jp ? (
              <span className="euph-ticker__jp" lang="ja">
                {text}
              </span>
            ) : (
              <span className="euph-ticker__en">{text}</span>
            )}
            <Star variant="ink" size={12} />
          </span>
        );
      })}
    </div>
  );
}

/** The yellow marquee strip. Duplicates its content for a seamless −50% loop. */
export function Ticker({
  items,
  groupsPerHalf = 6,
  secondsPerGroup = 16,
  absolute = false,
  className,
  style,
}: TickerProps) {
  const total = groupsPerHalf * 2;
  const duration = groupsPerHalf * secondsPerGroup;

  return (
    <div
      className={['euph-ticker', absolute ? 'euph-ticker--absolute' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="marquee"
      aria-label={items.join(' · ')}
    >
      <div
        className="euph-ticker__track"
        style={{ ['--euph-tick-duration' as string]: `${duration}s` }}
      >
        {Array.from({ length: total }, (_, i) => (
          <Group key={i} items={items} />
        ))}
      </div>
    </div>
  );
}
