import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

/**
 * Offcanvas - slide-out panel from the side
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether the offcanvas is visible
 * @param {function} props.onClose - Callback when closed
 * @param {'start'|'end'} props.placement - Which side to slide from
 * @param {string} props.title - Header title
 * @param {boolean} props.backdrop - Show backdrop
 * @param {boolean} props.scroll - Allow body scroll when open
 */
export function Offcanvas({
  show,
  onClose,
  placement = 'start',
  title,
  backdrop = true,
  className = '',
  children,
}) {
  const isLeft = placement === 'start';

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        {backdrop && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>
        )}

        {/* Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`
                pointer-events-none fixed inset-y-0 flex max-w-full
                ${isLeft ? 'left-0 pr-10' : 'right-0 pl-10'}
              `}
            >
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={isLeft ? '-translate-x-full' : 'translate-x-full'}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={isLeft ? '-translate-x-full' : 'translate-x-full'}
              >
                <DialogPanel
                  className={`
                    pointer-events-auto w-screen max-w-sm
                    bg-white shadow-xl
                    ${className}
                  `}
                >
                  <div className="flex h-full flex-col">
                    {/* Header */}
                    {title && (
                      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                          {title}
                        </DialogTitle>
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <span className="sr-only">Close panel</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {children}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Offcanvas;
