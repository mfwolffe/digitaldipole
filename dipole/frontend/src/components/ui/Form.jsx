import React, { forwardRef } from 'react';

/**
 * Input - styled text input
 */
export const Input = forwardRef(function Input({
  type = 'text',
  error,
  className = '',
  ...props
}, ref) {
  const baseClasses = 'block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';

  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClasses} ${stateClasses} ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    />
  );
});

/**
 * Select - styled dropdown select
 */
export const Select = forwardRef(function Select({
  error,
  className = '',
  children,
  ...props
}, ref) {
  const baseClasses = 'block w-full rounded-lg border px-3 py-2 text-gray-900 bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-no-repeat bg-right pr-10';

  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

  // Chevron SVG as background
  const chevronBg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

  return (
    <select
      ref={ref}
      className={`${baseClasses} ${stateClasses} ${className}`}
      style={{ backgroundImage: chevronBg, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    >
      {children}
    </select>
  );
});

/**
 * Label - form label
 */
export function Label({ htmlFor, required, className = '', children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </label>
  );
}

/**
 * FormGroup - wrapper for label + input + error message
 */
export function FormGroup({ className = '', children }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * ErrorMessage - form validation error display
 */
export function ErrorMessage({ className = '', children }) {
  if (!children) return null;

  return (
    <p className={`mt-1 text-sm text-error-600 ${className}`}>
      {children}
    </p>
  );
}

/**
 * InputGroup - combines input with addons (like unit labels)
 */
export function InputGroup({ className = '', children }) {
  return (
    <div className={`flex items-stretch ${className}`}>
      {children}
    </div>
  );
}

/**
 * InputAddon - prefix/suffix for InputGroup
 */
export function InputAddon({ position = 'end', className = '', children }) {
  const positionClasses = position === 'start'
    ? 'rounded-l-lg border-r-0'
    : 'rounded-r-lg border-l-0';

  return (
    <span
      className={`
        inline-flex items-center px-3 py-2
        border border-gray-300 bg-gray-50
        text-gray-500 text-sm
        ${positionClasses} ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * InputWithAddon - convenience wrapper for input with unit suffix
 */
export function InputWithAddon({
  addon,
  addonPosition = 'end',
  inputClassName = '',
  ...inputProps
}) {
  const inputRadius = addonPosition === 'start' ? 'rounded-l-none' : 'rounded-r-none';

  return (
    <InputGroup>
      {addonPosition === 'start' && (
        <InputAddon position="start">{addon}</InputAddon>
      )}
      <Input className={`${inputRadius} ${inputClassName}`} {...inputProps} />
      {addonPosition === 'end' && (
        <InputAddon position="end">{addon}</InputAddon>
      )}
    </InputGroup>
  );
}

export default {
  Input,
  Select,
  Label,
  FormGroup,
  ErrorMessage,
  InputGroup,
  InputAddon,
  InputWithAddon,
};
