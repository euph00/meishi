import { Contact, Star } from '@euph/ui';

export const OnPaper = () => (
  <div className="euph" style={{ padding: 28, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 13 }}>
    <Contact icon="x" label="Twitter" href="https://twitter.com/e_uph00" />
    <Star variant="ink" size={10} />
    <Contact icon="mail" label="Email" href="mailto:euph.f1eur@gmail.com" />
    <Star variant="ink" size={10} />
    <Contact icon="branch" label="GitHub" href="https://github.com/euph00" />
  </div>
);

export const OnInk = () => (
  <div style={{ padding: 28, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, background: '#17150F' }}>
    <Contact tone="on-ink" icon="x" label="Twitter" href="https://twitter.com/e_uph00" />
    <Star variant="yellow" size={9} />
    <Contact tone="on-ink" icon="mail" label="Email" href="mailto:euph.f1eur@gmail.com" />
    <Star variant="yellow" size={9} />
    <Contact tone="on-ink" icon="branch" label="GitHub" href="https://github.com/euph00" />
  </div>
);
