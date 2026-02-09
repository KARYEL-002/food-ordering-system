/**
 * Preload critical images to improve Core Web Vitals
 * Call this early in the app to preload hero and high-priority images
 */
export const preloadImages = (imageUrls) => {
  if (typeof window === 'undefined') return; // SSR safety check

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Prefetch images to load them in the background
 * Use for images that will be loaded soon but aren't critical
 */
export const prefetchImages = (imageUrls) => {
  if (typeof window === 'undefined') return; // SSR safety check

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
