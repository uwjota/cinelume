"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_PREFIX = "cinelume:scroll-position:";
const RESTORE_TARGET_KEY = "cinelume:scroll-restore-target";

function getStorageKey(pathname: string, search: string) {
  return `${STORAGE_PREFIX}${pathname}${search ? `?${search}` : ""}`;
}

function getStorageKeyFromUrl(url: URL) {
  return getStorageKey(url.pathname, url.search.slice(1));
}

function isInformationOrPlayerPage(pathname: string) {
  return /\/(filme|serie|anime|dorama|tv|esportes)\/[^/]+$/.test(pathname) ||
    /\/assistir\/(filme|serie)\/[^/]+$/.test(pathname);
}

/** Restores scroll only when leaving an information page or the player. */
export function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const storageKey = getStorageKey(pathname, search);
  const storageKeyRef = useRef(storageKey);
  const pathnameRef = useRef(pathname);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    storageKeyRef.current = storageKey;
    pathnameRef.current = pathname;
  }, [pathname, storageKey]);

  useEffect(() => {
    const originalScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    let frameId: number | null = null;
    const savePositionNow = () => {
      sessionStorage.setItem(storageKeyRef.current, String(window.scrollY));
    };

    const savePosition = () => {
      if (isNavigatingRef.current || frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        savePositionNow();
        frameId = null;
      });
    };

    const preservePositionBeforeNavigation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      savePositionNow();
      isNavigatingRef.current = true;
    };

    const setRestoreTarget = (destination: URL) => {
      if (isInformationOrPlayerPage(pathnameRef.current)) {
        sessionStorage.setItem(RESTORE_TARGET_KEY, getStorageKeyFromUrl(destination));
      } else {
        sessionStorage.removeItem(RESTORE_TARGET_KEY);
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (
        destination.origin === currentUrl.origin &&
        (destination.pathname !== currentUrl.pathname || destination.search !== currentUrl.search)
      ) {
        preservePositionBeforeNavigation();
        setRestoreTarget(destination);
      }
    };

    const handlePopState = () => {
      preservePositionBeforeNavigation();
      setRestoreTarget(new URL(window.location.href));
    };

    window.addEventListener("scroll", savePosition, { passive: true });
    window.addEventListener("pagehide", savePositionNow);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      savePositionNow();
      window.removeEventListener("scroll", savePosition);
      window.removeEventListener("pagehide", savePositionNow);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
      window.history.scrollRestoration = originalScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem(RESTORE_TARGET_KEY) === storageKey;
    sessionStorage.removeItem(RESTORE_TARGET_KEY);

    if (!shouldRestore) {
      const scrollToTopFrame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
      const navigationTimeout = window.setTimeout(() => {
        isNavigatingRef.current = false;
      }, 200);

      return () => {
        window.cancelAnimationFrame(scrollToTopFrame);
        window.clearTimeout(navigationTimeout);
      };
    }

    const savedPosition = Number(sessionStorage.getItem(storageKey));
    if (!Number.isFinite(savedPosition) || savedPosition <= 0) {
      const navigationTimeout = window.setTimeout(() => {
        isNavigatingRef.current = false;
      }, 200);
      return () => window.clearTimeout(navigationTimeout);
    }

    const restorePosition = () => window.scrollTo({ top: savedPosition, left: 0 });
    const initialFrame = window.requestAnimationFrame(restorePosition);
    const retryDelays = [100, 300, 700, 1400];
    const retryIds = retryDelays.map((delay) => window.setTimeout(restorePosition, delay));
    const navigationTimeout = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, retryDelays[retryDelays.length - 1] + 100);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      retryIds.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(navigationTimeout);
    };
  }, [storageKey]);

  return null;
}
