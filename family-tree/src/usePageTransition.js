import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

// Page changes with the browser's View Transitions API (Chrome, Edge; others just navigate).
// Returns an onClick handler for a <Link>. If `photoSelector` matches an element inside the
// clicked link, that element is named "person-photo" for the transition, so it grows into the
// profile photo (which carries the same name) on the new page.
export default function usePageTransition() {
  const navigate = useNavigate();

  return (event, to, photoSelector) => {
    const plainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!plainClick || !document.startViewTransition) return; // let the Link navigate normally

    event.preventDefault();
    const photo = photoSelector ? event.currentTarget.querySelector(photoSelector) : null;
    if (photo) photo.style.viewTransitionName = 'person-photo';

    // Safety net: the browser waits for a painted frame before starting, which never comes in a
    // background tab. If the page hasn't changed within 400ms, skip the animation and navigate.
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      flushSync(() => navigate(to));
    };
    const transition = document.startViewTransition(go);
    const fallback = setTimeout(() => {
      if (navigated) return;
      transition.skipTransition();
      go();
    }, 400);
    // A skipped transition rejects these promises; that's expected, so swallow it.
    transition.ready.catch(() => {});
    transition.updateCallbackDone.catch(() => {});
    transition.finished
      .catch(() => {})
      .finally(() => {
        clearTimeout(fallback);
        if (photo) photo.style.viewTransitionName = '';
      });
  };
}
