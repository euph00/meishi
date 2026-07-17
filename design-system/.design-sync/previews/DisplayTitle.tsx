import { DisplayTitle } from '@euph/ui';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="euph" style={{ padding: 32, minWidth: 460 }}>{children}</div>
);

// The italic <em> word carries the yellow paint-and-depart swipe.
export const Work = () => (
  <Frame>
    <DisplayTitle>
      Recent <em>Work</em>
    </DisplayTitle>
  </Frame>
);

export const Thoughts = () => (
  <Frame>
    <DisplayTitle>
      Miscellaneous <em>Thoughts</em>
    </DisplayTitle>
  </Frame>
);

export const Wings = () => (
  <Frame>
    <DisplayTitle>
      Notes from <em>the Wings</em>
    </DisplayTitle>
  </Frame>
);
