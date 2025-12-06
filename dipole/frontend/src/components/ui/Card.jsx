import React from 'react';

/**
 * Card - container with shadow and rounded corners
 */
export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - styled header area
 */
export function CardHeader({ className = '', children }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardTitle - title within header
 */
export function CardTitle({ as: Component = 'h3', className = '', children }) {
  return (
    <Component className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </Component>
  );
}

/**
 * CardBody - main content area
 */
export function CardBody({ className = '', children }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardFooter - footer area (usually for actions)
 */
export function CardFooter({ className = '', children }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}

export default Card;
