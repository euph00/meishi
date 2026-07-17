import { PostRow } from '@euph/ui';

export const Essay = () => (
  <div className="euph" style={{ padding: 28, maxWidth: 720 }}>
    <PostRow
      date="2026.07.13"
      tag="ESSAY"
      title="The Photocopy Machine at the Temple"
      excerpt="The case against generated images as fan art"
      href="#"
      draw
    />
    <div style={{ borderTop: '1px solid var(--ink-35)' }} />
  </div>
);

export const List = () => (
  <div className="euph" style={{ padding: 28, maxWidth: 720 }}>
    <PostRow
      date="2026.07.13"
      tag="ESSAY"
      title="The Photocopy Machine at the Temple"
      excerpt="The case against generated images as fan art"
      href="#"
      draw
    />
    <PostRow
      date="2026.04.02"
      tag="STUDIO"
      title="Rebuilding my palette around one yellow"
      excerpt="Notes on limiting colour until it starts doing the work for you"
      href="#"
      draw
    />
    <div style={{ borderTop: '1px solid var(--ink-35)' }} />
  </div>
);
