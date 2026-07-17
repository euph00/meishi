import { Star } from '@euph/ui';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="euph" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 24 }}>
    {children}
  </div>
);

export const Ink = () => (
  <Row>
    <Star variant="ink" size={28} />
    <Star variant="ink" size={44} />
    <Star variant="ink" size={64} />
  </Row>
);

export const Yellow = () => (
  <Row>
    <Star variant="yellow" size={28} />
    <Star variant="yellow" size={44} />
    <Star variant="yellow" size={64} />
  </Row>
);

export const Badge = () => (
  <Row>
    <Star variant="badge" size={28} />
    <Star variant="badge" size={44} />
    <Star variant="badge" size={64} />
  </Row>
);

export const Idle = () => (
  <Row>
    <Star variant="badge" size={48} spin />
    <Star variant="yellow" size={48} twinkle />
  </Row>
);
