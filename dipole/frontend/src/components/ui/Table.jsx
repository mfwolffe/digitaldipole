import React from 'react';

/**
 * Table - styled data table
 */
export function Table({ striped = false, hover = false, className = '', style = {}, children }) {
  const stripedClass = striped ? 'table-striped' : '';
  const hoverClass = hover ? 'table-hover' : '';

  return (
    <table
      className={`w-full border-collapse ${stripedClass} ${hoverClass} ${className}`}
      style={style}
    >
      {children}
    </table>
  );
}

// Add CSS classes for striped and hover via a style tag or handle in component
// For now, we'll use inline approach with Tailwind

export function StyledTable({
  striped = false,
  hover = false,
  className = '',
  style = {},
  children
}) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table
        className={`w-full text-sm text-left ${className}`}
        style={style}
      >
        {children}
      </table>
    </div>
  );
}

export default Table;
