/**
 * MathJax Lazy Loader
 *
 * Loads MathJax on demand instead of globally, saving ~100KB on pages
 * that don't need equation rendering (home, meme generator, etc.).
 */

let loadPromise = null;
let isLoaded = false;

/**
 * Load MathJax if not already loaded
 * @returns {Promise<void>} Resolves when MathJax is ready
 */
export function loadMathJax() {
  // Already loaded
  if (isLoaded || window.MathJax?.typeset) {
    return Promise.resolve();
  }

  // Already loading
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if already in DOM (e.g., from index.html during transition)
    if (window.MathJax?.typeset) {
      isLoaded = true;
      resolve();
      return;
    }

    // Configure MathJax before loading
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      },
      svg: {
        fontCache: 'global'
      },
      startup: {
        ready: () => {
          window.MathJax.startup.defaultReady();
          isLoaded = true;
          resolve();
        }
      }
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load MathJax'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Typeset MathJax content (loads MathJax first if needed)
 * @param {HTMLElement|HTMLElement[]} [elements] - Elements to typeset, or typeset all
 */
export async function typesetMath(elements) {
  await loadMathJax();

  if (window.MathJax?.typeset) {
    if (elements) {
      window.MathJax.typesetClear(Array.isArray(elements) ? elements : [elements]);
      window.MathJax.typeset(Array.isArray(elements) ? elements : [elements]);
    } else {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }
}

/**
 * Check if MathJax is loaded and ready
 */
export function isMathJaxReady() {
  return isLoaded && window.MathJax?.typeset;
}
