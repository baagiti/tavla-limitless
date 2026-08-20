/**
 * Some WKWebView/Capacitor builds report `100dvh` unreliably — either
 * ignoring it outright on older iOS, or settling on a stale value before the
 * WebView's real safe-area/toolbar layout finishes on first paint. That
 * leaves the app's root container far shorter than the actual screen, which
 * shows up as a large dead gap of background between the header/board and
 * the footer (both centered independently within a mis-measured height).
 *
 * This computes the true visual viewport height in JS and exposes it as a
 * CSS custom property, which every full-height container uses as its real
 * source of truth instead of relying on the `dvh` unit alone.
 */
function setAppVh() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-vh', `${height * 0.01}px`);
}

setAppVh();
window.addEventListener('resize', setAppVh);
window.addEventListener('orientationchange', setAppVh);
window.visualViewport?.addEventListener('resize', setAppVh);
// Some WebViews settle their real safe-area/toolbar layout a moment after
// the orientation event itself fires — catch that late correction too.
window.addEventListener('orientationchange', () => setTimeout(setAppVh, 300));
