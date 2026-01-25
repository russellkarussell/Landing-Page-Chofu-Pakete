import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACQcgnruJRIzL2DQ";

export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRequired, setIsRequired] = useState(true); // Assume required until we know otherwise
  const retryCountRef = useRef(0);

  // Fetch Turnstile config from server to determine if it's required
  useEffect(() => {
    fetch("/api/config/turnstile")
      .then((res) => res.json())
      .then((data) => {
        setIsRequired(data.required);
      })
      .catch(() => {
        // If config fetch fails, assume Turnstile is required (safe default)
        setIsRequired(true);
      });
  }, []);

  const reset = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setToken(null);
      setHasError(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initTurnstile = () => {
      if (!window.turnstile) {
        retryCountRef.current++;
        if (retryCountRef.current < 50) {
          setTimeout(initTurnstile, 100);
        } else {
          console.warn("[Turnstile] Failed to load after 5s, allowing form submission without CAPTCHA");
          setHasError(true);
          setIsReady(true);
        }
        return;
      }

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }

      try {
        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t: string) => {
            setToken(t);
            setHasError(false);
          },
          "error-callback": () => {
            console.warn("[Turnstile] Error callback triggered, allowing form submission without CAPTCHA");
            setToken(null);
            setHasError(true);
          },
          "expired-callback": () => {
            setToken(null);
          },
          theme: "light",
          size: "normal",
        });
        setIsReady(true);
      } catch (err) {
        console.warn("[Turnstile] Failed to render widget:", err);
        setHasError(true);
        setIsReady(true);
      }
    };

    initTurnstile();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Valid if: has token, OR (has error AND turnstile is not required in this environment)
  const isValid = token !== null || (hasError && !isRequired);

  return { containerRef, token, isReady, hasError, isValid, isRequired, reset };
}
