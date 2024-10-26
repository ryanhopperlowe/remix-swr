import { useEffect } from "react";
import { useRevalidate } from "./useRevalidate";

export function useRevalidateOnFocus(config?: { enabled?: boolean }) {
  const { enabled = true } = config ?? {};

  const revalidate = useRevalidate();

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("focus", revalidate);

    return () => window.removeEventListener("focus", revalidate);
  }, [revalidate, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("visibilitychange", revalidate);
    return () => window.removeEventListener("visibilitychange", revalidate);
  }, [revalidate, enabled]);
}
