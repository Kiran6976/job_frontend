import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component scrolls the window to the top on every route change,
 * ensuring new pages (like JobDetails) begin from the hero section rather than
 * retaining the previous page's scroll position.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
