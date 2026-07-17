import { LabelMono } from '@euph/ui';

export const Eyebrows = () => (
  <div className="euph" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <LabelMono>PRODUCER TRACK</LabelMono>
    <LabelMono>Illustrations</LabelMono>
    <LabelMono>Musings</LabelMono>
  </div>
);

export const Japanese = () => (
  <div className="euph" style={{ padding: 28, display: 'flex', gap: 20 }}>
    <LabelMono lang="ja">上演中</LabelMono>
    <LabelMono lang="ja">近作</LabelMono>
  </div>
);
