/**
 * Product Component
 *
 * Renders a multiplication of terms with × symbols between them.
 */
import React from 'react';

export function Product({ factors, className = '' }) {
  if (!factors || factors.length === 0) {
    return null;
  }

  if (factors.length === 1) {
    return <>{factors[0]}</>;
  }

  return (
    <span className={`eq-product ${className}`}>
      {factors.map((factor, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="eq-multiply">×</span>}
          {factor}
        </React.Fragment>
      ))}
    </span>
  );
}

export default Product;
