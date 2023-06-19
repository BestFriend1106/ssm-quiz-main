import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { ComponentWithChildren } from 'types'

type ModalProps = ComponentWithChildren & {
  isOpen: boolean
  onClose?(): void
  hasTransparentBackground?: boolean
  className?: string
}

export default function BaseModal({
  isOpen,
  children,
  hasTransparentBackground,
  className,
  onClose = () => {},
}: ModalProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={twMerge(
                    'w-full max-w-md p-6 text-left align-middle transition-all transform rounded-2xl',
                    !hasTransparentBackground && 'bg-white shadow-xl ',
                    className
                  )}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
