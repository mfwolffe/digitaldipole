import React, { useState, useCallback } from 'react';

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

  // Use controlled or uncontrolled mode
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  // Convert children to array
  const slides = React.Children.toArray(children);
  const slideCount = slides.length;

  const goTo = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, slideCount - 1));
    if (onSelect) {
      onSelect(newIndex);
    } else {
      setInternalIndex(newIndex);
    }
  }, [onSelect, slideCount]);

  const goToPrev = () => goTo(activeIndex - 1);
  const goToNext = () => goTo(activeIndex + 1);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Slides container */}
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              ${fade ? 'absolute inset-0' : ''}
              transition-opacity duration-500 ease-in-out
              ${index === activeIndex ? 'opacity-100 relative' : 'opacity-0 hidden'}
            `}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={activeIndex === slideCount - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      {slideCount > 1 && slideCount <= 10 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter for many slides */}
      {slideCount > 10 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {slideCount}
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
