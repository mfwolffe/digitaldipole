import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

/**
 * Modal - dialog/modal component
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {function} props.onClose - Callback when modal closes
 * @param {boolean} props.backdrop - Show backdrop (default true)
 * @param {boolean} props.keyboard - Allow closing with escape key (default true)
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Modal size
 */
export function Modal({
  show,
  onClose,
  backdrop = true,
  keyboard = true,
  size = 'md',
  className = '',
  children,
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleClose = () => {
    if (backdrop === 'static') return; // Don't close on backdrop click
    onClose();
  };

  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={keyboard ? onClose : () => {}}
      >
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        {/* Modal positioning */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`
                  w-full ${sizeClasses[size] || sizeClasses.md}
                  transform overflow-hidden rounded-xl
                  bg-slate-800 text-white
                  shadow-2xl transition-all
                  ${className}
                `}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/**
 * ModalHeader - header with title and optional close button
 */
export function ModalHeader({ onClose, className = '', children }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-700 ${className}`}>
      <DialogTitle as="h3" className="text-lg font-semibold">
        {children}
      </DialogTitle>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:text-gray-200 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ModalBody - main content area
 */
export function ModalBody({ className = '', children }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * ModalFooter - footer area for actions
 */
export function ModalFooter({ className = '', children }) {
  return (
    <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

export default Modal;
