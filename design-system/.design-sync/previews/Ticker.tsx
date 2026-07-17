import { Ticker } from '@euph/ui';

// Full-width marquee; Japanese entries are auto-detected and styled.
export const Events = () => (
  <div className="euph" style={{ minWidth: 640 }}>
    <Ticker
      items={[
        'NEXT EVENT - 参加予定',
        '学マス LIVE TOUR -標- ツアーファイナル DAY1 07.11.2026',
        'コミックマーケットC109 29-31.12.2026',
      ]}
    />
  </div>
);

export const English = () => (
  <div className="euph" style={{ minWidth: 640 }}>
    <Ticker items={['NOW SHOWING', 'SELECTED WORK 2020–2026', 'LIMITED ENGAGEMENT']} />
  </div>
);
