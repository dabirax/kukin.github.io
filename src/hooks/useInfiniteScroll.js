import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
  enabled = true,
  onLoadMore,
  rootMargin = "400px",
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore?.();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, rootMargin]);

  return sentinelRef;
};
