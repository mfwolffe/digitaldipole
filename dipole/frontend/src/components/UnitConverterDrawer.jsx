/**
 * UnitConverterDrawer Component
 *
 * Slide-out drawer containing the unit converter.
 * Can be opened from within calculators for quick conversions.
 */
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UnitConverter } from './UnitConverter';

/**
 * UnitConverterDrawer - slide-out panel with unit converter
 *
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {Function} onClose - Callback when drawer should close
 * @param {string} initialDimension - Initial dimension to show
 */
export function UnitConverterDrawer({ isOpen, onClose, initialDimension = 'pressure' }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-in panel from right */}
        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-full max-w-md bg-white shadow-xl flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Unit Converter
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <UnitConverter initialDimension={initialDimension} compact />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default UnitConverterDrawer;
