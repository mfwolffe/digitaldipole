/**
 * EquationDisplay Component
 *
 * Displays a LaTeX equation using MathJax.
 */
import React, { useEffect, useRef } from 'react';

export function EquationDisplay({ latex, displayMode = true, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      // Clear and re-typeset when latex changes
      window.MathJax.typesetClear([containerRef.current]);
      window.MathJax.typeset([containerRef.current]);
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
