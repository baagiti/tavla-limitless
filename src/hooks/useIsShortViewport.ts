import { useEffect, useState } from 'react';

// True on landscape phones, where header + footer chrome competes directly
// with the board for a very limited amount of vertical space (as little as
// ~380-430px). Tracked in JS rather than CSS media queries alone because the
// header/footer need to structurally change (different markup, not just
// smaller paddings) once space is this tight.
const QUERY = '(max-height: 520px)';

export function useIsShortViewport(): boolean {
  const [isShort, setIsShort] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setIsShort(mql.matches);
    update();
    mql.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    // Belt-and-suspenders: some WebView/embedded contexts change the layout
    // viewport (e.g. rotating the device) without reliably firing a window
    // 'resize' event, so also watch the root element's actual box directly.
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    return () => {
      mql.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, []);

  return isShort;
}
