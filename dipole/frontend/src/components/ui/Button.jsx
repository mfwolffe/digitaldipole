import React from 'react';

/**
 * Button variants and their corresponding Tailwind classes
 */
const variants = {
  primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
  outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
  'outline-secondary': 'border-2 border-gray-400 text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
  ghost: 'text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  link: 'text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline p-0',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

/**
 * Reusable Button component with Tailwind styling
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'outline-secondary'|'ghost'|'danger'|'success'|'link'} props.variant
 * @param {'sm'|'md'|'lg'|'icon'} props.size
 * @param {boolean} props.disabled
 * @param {boolean} props.loading
 * @param {string} props.className - Additional classes to merge
 * @param {React.ReactNode} props.children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
