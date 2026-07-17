import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
// Tokens are imported by the barrel too, but bring them in explicitly here so
// the gallery entry never depends on the barrel's side-effect import surviving
// tree-shaking.
import '../styles/tokens.css';
import {
  Star,
  Icon,
  LabelMono,
  Rule,
  Contact,
  SectionHeader,
  DisplayTitle,
  WorkCard,
  PostRow,
  Ticker,
} from '../index';
import './gallery.css';

// A paper-toned 4:5 placeholder so WorkCard renders without real artwork.
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

function Section({
  title,
  api,
  note,
  children,
}: {
  title: string;
  api: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="gallery__section">
      <div className="gallery__label">
        <h2>{title}</h2>
        <code>{api}</code>
      </div>
      {note ? <p className="gallery__note">{note}</p> : null}
      {children}
    </section>
  );
}

function Gallery() {
  // bump to remount the animated components so their entrance replays
  const [replay, setReplay] = useState(0);

  return (
    <div className="euph gallery">
      <div className="gallery__masthead">
        <h1>EUPH UI</h1>
        <p>the "Stage" design system — {`components extracted from the portfolio`}</p>
      </div>
      <button
        onClick={() => setReplay((n) => n + 1)}
        className="euph-label-mono"
        style={{
          border: '1px solid var(--ink)',
          background: 'transparent',
          padding: '10px 16px',
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        ▸ REPLAY MOTION
      </button>

      <Section title="Colour" api="tokens.css">
        <div className="gallery__swatches">
          <div className="gallery__swatch" style={{ background: 'var(--paper)' }}>--paper</div>
          <div className="gallery__swatch" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>--ink</div>
          <div className="gallery__swatch" style={{ background: 'var(--yellow)' }}>--yellow</div>
          <div className="gallery__swatch" style={{ background: 'var(--link-hover)' }}>--link-hover</div>
        </div>
      </Section>

      <Section title="Star" api="<Star variant size spin twinkle />" note="The four-pointed motif. Badge = yellow fill with an ink outline; spins as idle motion in section headers.">
        <div className="gallery__row">
          <Star variant="ink" size={40} />
          <Star variant="yellow" size={40} />
          <Star variant="badge" size={40} />
          <Star variant="yellow" size={24} twinkle key={`tw-${replay}`} />
          <Star variant="badge" size={24} spin key={`sp-${replay}`} />
        </div>
      </Section>

      <Section title="Icon" api="<Icon name size />" note="Line-drawn contact glyphs; colour follows currentColor.">
        <div className="gallery__row">
          <Icon name="x" size={28} />
          <Icon name="mail" size={28} />
          <Icon name="branch" size={28} />
        </div>
      </Section>

      <Section title="LabelMono" api="<LabelMono>">
        <div className="gallery__row">
          <LabelMono>PRODUCER TRACK</LabelMono>
          <LabelMono>Illustrations</LabelMono>
          <LabelMono lang="ja">上演中</LabelMono>
        </div>
      </Section>

      <Section title="Rule" api="<Rule tone draw origin flex />" note="1px hairline; optionally draws itself in on mount.">
        <div className="gallery__stack" key={`rule-${replay}`}>
          <div className="gallery__row" style={{ gap: 16 }}>
            <LabelMono>PRODUCER TRACK</LabelMono>
            <Rule tone="ink" draw />
          </div>
          <Rule tone="ink-35" flex={false} draw />
        </div>
      </Section>

      <Section title="Contact" api="<Contact icon label href tone />" note="Icon + underlined link, padded to a ≥44px hit target.">
        <div className="gallery__row">
          <Contact icon="x" label="Twitter" href="https://twitter.com/e_uph00" />
          <Star variant="ink" size={10} />
          <Contact icon="mail" label="Email" href="mailto:euph.f1eur@gmail.com" />
          <Star variant="ink" size={10} />
          <Contact icon="branch" label="GitHub" href="https://github.com/euph00" />
        </div>
      </Section>

      <Section title="SectionHeader" api="<SectionHeader label jp draw />" note="The eyebrow that opens each Act: badge star + mono label + rule + JP tag.">
        <div key={`sh-${replay}`}>
          <SectionHeader label="Illustrations" jp="近作" draw />
        </div>
      </Section>

      <Section title="DisplayTitle" api="<DisplayTitle swipe>…<em/>…</DisplayTitle>" note="Big serif heading; the italic <em> word gets the yellow paint-and-depart swipe. Press REPLAY MOTION to watch it.">
        <div key={`dt-${replay}`} className="gallery__stack">
          <DisplayTitle swipe>
            Recent <em>Work</em>
          </DisplayTitle>
          <DisplayTitle swipe>
            Miscellaneous <em>Thoughts</em>
          </DisplayTitle>
        </div>
      </Section>

      <Section title="WorkCard" api="<WorkCard title meta image href />" note="Framed artwork with an italic title and mono meta; lifts on hover. External links append ↗.">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: 'clamp(20px, 3vw, 36px)',
            maxWidth: 720,
          }}
        >
          <WorkCard
            title="ぷろでゅーさー♡"
            meta="01 — 07.2026"
            image={placeholder('ARTWORK 01')}
            width={300}
            height={375}
            href="https://x.com/e_uph00"
          />
          <WorkCard
            title="異議あり！"
            meta="02 — 07.2026"
            image={placeholder('ARTWORK 02')}
            width={300}
            height={375}
            href="https://x.com/e_uph00"
          />
        </div>
      </Section>

      <Section title="PostRow" api="<PostRow date tag title excerpt href draw />" note="A blog index row; slides right on hover.">
        <div style={{ maxWidth: 860 }} key={`pr-${replay}`}>
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
      </Section>

      <Section title="Ticker" api="<Ticker items secondsPerGroup />" note="Yellow marquee; Japanese entries auto-styled. Duplicates content for a seamless loop.">
        <Ticker
          items={[
            'NEXT EVENT - 参加予定',
            '学マス LIVE TOUR -標- ツアーファイナル DAY1 07.11.2026',
            'コミックマーケットC109 29-31.12.2026',
          ]}
        />
      </Section>

      <div className="gallery__panel--ink">
        <div className="gallery__label">
          <h2>Contact — on-ink tone</h2>
          <code>&lt;Contact tone="on-ink" /&gt;</code>
        </div>
        <div className="gallery__row">
          <Contact tone="on-ink" icon="x" label="Twitter" href="https://twitter.com/e_uph00" />
          <Star variant="yellow" size={9} />
          <Contact tone="on-ink" icon="mail" label="Email" href="mailto:euph.f1eur@gmail.com" />
          <Star variant="yellow" size={9} />
          <Contact tone="on-ink" icon="branch" label="GitHub" href="https://github.com/euph00" />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
