import { useState } from 'react';

/**
 * OptimizedImage component with fallback
 * Uses native lazy loading for performance
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '🍲',
  fallbackColor = 'bg-gradient-to-br from-orange-400 to-red-500'
}) => {
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  // Error state: show fallback
  if (hasError || !src) {
    return (
      <div 
        className={`${className} ${fallbackColor} flex items-center justify-center text-6xl`}
        role="img"
        aria-label={alt}
      >
        {placeholder}
      </div>
    );
  }

  // Loaded state: show image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
      decoding="async"
    />
  );
};

export default OptimizedImage;
