import { useEffect } from "react";
import { useRevalidate } from "./useRevalidate";

interface Options {
  enabled?: boolean;
  interval?: number;
}

export function useRevalidateOnInterval(config?: Options) {
  const { enabled = true, interval = 1000 } = config || {};
  const revalidate = useRevalidate();

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(revalidate, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, revalidate]);
}
