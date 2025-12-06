/**
 * Fuzzy Search Utility
 *
 * Simple fuzzy matching algorithm that scores matches based on:
 * - Exact match (highest priority)
 * - Starts with query
 * - Contains query as substring
 * - Fuzzy character matching (characters appear in order)
 */

/**
 * Calculate fuzzy match score between query and target string
 * Returns 0 for no match, higher numbers for better matches
 *
 * @param {string} query - Search query (lowercase)
 * @param {string} target - Target string to match against (lowercase)
 * @returns {number} Match score (0 = no match)
 */
export function fuzzyScore(query, target) {
  if (!query || !target) return 0;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact match - highest score
  if (t === q) return 100;

  // Starts with query - very high score
  if (t.startsWith(q)) return 80 + (q.length / t.length) * 10;

  // Contains query as substring - high score
  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    // Word boundary bonus (matches at start of a word)
    const atWordBoundary = substringIndex === 0 || /\s/.test(t[substringIndex - 1]);
    return 60 + (atWordBoundary ? 10 : 0) + (q.length / t.length) * 5;
  }

  // Fuzzy matching - characters appear in order
  let queryIdx = 0;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;
  let lastMatchIdx = -2;

  for (let i = 0; i < t.length && queryIdx < q.length; i++) {
    if (t[i] === q[queryIdx]) {
      // Track consecutive matches
      if (i === lastMatchIdx + 1) {
        consecutiveMatches++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
      } else {
        consecutiveMatches = 1;
      }
      lastMatchIdx = i;
      queryIdx++;
    }
  }

  // All query characters found in order
  if (queryIdx === q.length) {
    // Score based on how compact the match is
    const coverage = q.length / t.length;
    const consecutiveBonus = maxConsecutive / q.length;
    return 20 + coverage * 15 + consecutiveBonus * 10;
  }

  return 0;
}

/**
 * Search through items and return matches sorted by relevance
 *
 * @param {string} query - Search query
 * @param {Array} items - Array of searchable items
 * @param {Object} options - Search options
 * @param {string[]} options.keys - Keys to search within each item
 * @param {number} options.threshold - Minimum score to include (default: 10)
 * @param {number} options.limit - Max results to return (default: 20)
 * @returns {Array} Sorted array of { item, score, matchedKey }
 */
export function fuzzySearch(query, items, options = {}) {
  const {
    keys = ['name'],
    threshold = 10,
    limit = 20
  } = options;

  if (!query || query.length === 0) return [];

  const results = [];

  for (const item of items) {
    let bestScore = 0;
    let matchedKey = null;

    for (const key of keys) {
      const value = getNestedValue(item, key);
      if (typeof value === 'string') {
        const score = fuzzyScore(query, value);
        if (score > bestScore) {
          bestScore = score;
          matchedKey = key;
        }
      } else if (Array.isArray(value)) {
        // Handle arrays (e.g., searching variable names)
        for (const v of value) {
          if (typeof v === 'string') {
            const score = fuzzyScore(query, v);
            if (score > bestScore) {
              bestScore = score;
              matchedKey = key;
            }
          }
        }
      }
    }

    if (bestScore >= threshold) {
      results.push({ item, score: bestScore, matchedKey });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Highlight matching characters in text
 * Returns array of { text, highlight } segments
 *
 * @param {string} query - Search query
 * @param {string} text - Text to highlight
 * @returns {Array} Array of segments
 */
export function highlightMatches(query, text) {
  if (!query || !text) return [{ text, highlight: false }];

  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const segments = [];

  // Try substring match first
  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    if (substringIndex > 0) {
      segments.push({ text: text.slice(0, substringIndex), highlight: false });
    }
    segments.push({ text: text.slice(substringIndex, substringIndex + q.length), highlight: true });
    if (substringIndex + q.length < text.length) {
      segments.push({ text: text.slice(substringIndex + q.length), highlight: false });
    }
    return segments;
  }

  // Fuzzy highlight - highlight matching characters
  let queryIdx = 0;
  let lastHighlightEnd = 0;

  for (let i = 0; i < text.length && queryIdx < q.length; i++) {
    if (t[i] === q[queryIdx]) {
      if (i > lastHighlightEnd) {
        segments.push({ text: text.slice(lastHighlightEnd, i), highlight: false });
      }
      segments.push({ text: text[i], highlight: true });
      lastHighlightEnd = i + 1;
      queryIdx++;
    }
  }

  if (lastHighlightEnd < text.length) {
    segments.push({ text: text.slice(lastHighlightEnd), highlight: false });
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

export default { fuzzyScore, fuzzySearch, highlightMatches };
