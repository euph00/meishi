import { Rule, LabelMono } from '@euph/ui';

// A rule alone is a 1px line; the honest preview is the rule in the label row
// it actually connects.
export const InLabelRow = () => (
  <div className="euph" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 16, minWidth: 320 }}>
    <LabelMono>PRODUCER TRACK</LabelMono>
    <Rule tone="ink" draw />
  </div>
);

export const Tones = () => (
  <div className="euph" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22, minWidth: 320 }}>
    <Rule tone="ink" flex={false} draw />
    <Rule tone="ink-35" flex={false} draw />
  </div>
);
