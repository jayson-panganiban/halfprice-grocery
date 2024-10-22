import { useState, useEffect, useRef, useCallback } from 'react';

function useInfiniteScroll(initialItemCount = 20, incrementAmount = 20) {
  const [visibleItems, setVisibleItems] = useState(initialItemCount);
  const sentinelRef = useRef(null);

  const loadMoreItems = useCallback(() => {
    setVisibleItems((prevCount) => prevCount + incrementAmount);
  }, [incrementAmount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems]);

  return { visibleItems, sentinelRef };
}

export default useInfiniteScroll;
