import React, { useState, useCallback, useEffect } from 'react';

/**
 * Carousel - image/content slider
 *
 * @param {Object} props
 * @param {number} props.activeIndex - Controlled active slide index
 * @param {function} props.onSelect - Callback when slide changes
 * @param {boolean} props.fade - Use fade transition instead of slide
 * @param {number|null} props.interval - Auto-advance interval in ms (null to disable)
 */
export function Carousel({
  activeIndex: controlledIndex,
  onSelect,
  fade = false,
  interval = null,
  className = '',
  children,
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use controlled or uncontrolled mode
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  // Convert children to array
  const slides = React.Children.toArray(children);
  const slideCount = slides.length;

  const goTo = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, slideCount - 1));
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
    if (onSelect) {
      onSelect(newIndex);
    } else {
      setInternalIndex(newIndex);
    }
  }, [onSelect, slideCount]);

  const goToPrev = () => goTo(activeIndex - 1);
  const goToNext = () => goTo(activeIndex + 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slideCount]);

  return (
    <div className={`relative ${className}`}>
      {/* Slides container */}
      <div className="relative" style={{ minHeight: '550px' }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              transition: 'opacity 300ms ease-in-out',
              opacity: index === activeIndex ? 1 : 0,
              position: index === activeIndex ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: index === activeIndex ? 10 : 0,
              pointerEvents: index === activeIndex ? 'auto' : 'none',
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Bottom navigation bar */}
      {slideCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 py-3">
          <button
            type="button"
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slide counter */}
          <div className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium min-w-[80px] text-center">
            {activeIndex + 1} / {slideCount}
          </div>

          <button
            type="button"
            onClick={goToNext}
            disabled={activeIndex === slideCount - 1}
            className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * CarouselItem - individual slide wrapper
 */
export function CarouselItem({ id, className = '', children }) {
  return (
    <div id={id} className={`carousel-item ${className}`}>
      {children}
    </div>
  );
}

export default Carousel;
