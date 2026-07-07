"use client";

import { useEffect, useRef, useState } from "react";

export function useContainerWidth<T extends HTMLElement>(initial = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
