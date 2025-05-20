import { useEffect, useRef, useState } from "react";

export function useElementWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initialize with the current width
    setWidth(element.getBoundingClientRect().width);

    // Set up ResizeObserver to track width changes
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const entry = entries[0];
      if (entry) {
        const { width } = entry.contentRect;
        setWidth(width);
      }
    });

    resizeObserver.observe(element);

    // Clean up observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, width };
}
