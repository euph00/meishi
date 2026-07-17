import { WorkCard } from '@euph/ui';

// A paper-toned 4:5 placeholder so the card renders without real artwork.
function placeholder(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 375">
    <rect width="300" height="375" fill="#E4DECF"/>
    <path transform="translate(118 150) scale(0.64)" fill="#17150F" fill-opacity="0.14"
      d="M50 0C54.5 33.5 66.5 45.5 100 50C66.5 54.5 54.5 66.5 50 100C45.5 66.5 33.5 54.5 0 50C33.5 45.5 45.5 33.5 50 0Z"/>
    <text x="150" y="330" text-anchor="middle" font-family="monospace" font-size="13"
      letter-spacing="2" fill="#17150F" fill-opacity="0.5">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="euph" style={{ padding: 28, width: 300 }}>{children}</div>
);

// External link: whole card links out, meta gets a ↗.
export const External = () => (
  <Frame>
    <WorkCard
      title="ぷろでゅーさー♡"
      meta="01 — 07.2026"
      image={placeholder('ARTWORK 01')}
      width={300}
      height={375}
      href="https://x.com/e_uph00"
    />
  </Frame>
);

// Plain card: no link, no ↗.
export const Plain = () => (
  <Frame>
    <WorkCard title="異議あり！" meta="02 — 07.2026" image={placeholder('ARTWORK 02')} width={300} height={375} />
  </Frame>
);
