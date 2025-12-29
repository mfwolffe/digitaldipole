/**
 * EquationDisplay Component
 *
 * Displays a LaTeX equation using MathJax (lazy-loaded).
 */
import React, { useEffect, useRef } from 'react';
import { typesetMath } from '../../utils/mathjax-loader';

export function EquationDisplay({ latex, displayMode = true, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      // Lazy load MathJax and typeset
      typesetMath([containerRef.current]);
    }
  }, [latex]);

  if (!latex) return null;

  const wrappedLatex = displayMode ? `$$${latex}$$` : `\\(${latex}\\)`;

  return (
    <div ref={containerRef} className={`equation-display ${className}`}>
      {wrappedLatex}
    </div>
  );
}

export default EquationDisplay;
