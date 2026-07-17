// EUPH "Stage" design system — public entry.
// Import order matters: tokens (custom properties + shared keyframes) first,
// then components pull in their own CSS.
import './styles/tokens.css';

export { Star } from './components/Star/Star';
export type { StarProps, StarVariant } from './components/Star/Star';

export { Icon } from './components/Icon/Icon';
export type { IconProps, IconName } from './components/Icon/Icon';

export { LabelMono } from './components/LabelMono/LabelMono';
export type { LabelMonoProps } from './components/LabelMono/LabelMono';

export { Rule } from './components/Rule/Rule';
export type { RuleProps, RuleTone, RuleOrigin } from './components/Rule/Rule';

export { Contact } from './components/Contact/Contact';
export type { ContactProps, ContactTone } from './components/Contact/Contact';

export { SectionHeader } from './components/SectionHeader/SectionHeader';
export type { SectionHeaderProps } from './components/SectionHeader/SectionHeader';

export { DisplayTitle } from './components/DisplayTitle/DisplayTitle';
export type { DisplayTitleProps } from './components/DisplayTitle/DisplayTitle';

export { WorkCard } from './components/WorkCard/WorkCard';
export type { WorkCardProps } from './components/WorkCard/WorkCard';

export { PostRow } from './components/PostRow/PostRow';
export type { PostRowProps } from './components/PostRow/PostRow';

export { Ticker } from './components/Ticker/Ticker';
export type { TickerProps } from './components/Ticker/Ticker';

export { STAR_PATH, STAR_VIEWBOX } from './star-path';
