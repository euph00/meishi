import type { CSSProperties } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './Contact.css';

export type ContactTone = 'ink' | 'on-ink';

export interface ContactProps {
  /** Which contact glyph to show. */
  icon: IconName;
  /** Visible link text (e.g. "Twitter"). */
  label: string;
  href: string;
  /**
   * `ink` — on the paper hero (ink text, ink icon).
   * `on-ink` — in the dark Curtain Call footer (paper text, yellow icon, hover→yellow).
   * Default `ink`.
   */
  tone?: ContactTone;
  /** Override the icon size (px). Defaults match the site per tone. */
  iconSize?: number;
  className?: string;
  style?: CSSProperties;
}

// Site-exact glyph sizes: the hero enlarges them for readability; the footer
// keeps the original handoff sizes.
const ICON_SIZES: Record<ContactTone, Record<IconName, number>> = {
  ink: { x: 16, mail: 17, branch: 17 },
  'on-ink': { x: 13, mail: 14, branch: 14 },
};

/** A contact link: line icon + underlined label. Padded to a ≥44px hit target. */
export function Contact({ icon, label, href, tone = 'ink', iconSize, className, style }: ContactProps) {
  const size = iconSize ?? ICON_SIZES[tone][icon];
  return (
    <a
      className={['euph-contact', `euph-contact--${tone}`, className ?? ''].filter(Boolean).join(' ')}
      href={href}
      style={style}
    >
      <Icon name={icon} size={size} className="euph-contact__icon" />
      <span>{label}</span>
    </a>
  );
}
