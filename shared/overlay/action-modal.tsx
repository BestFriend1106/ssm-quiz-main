import classNames from 'classnames'
import { Dialog } from '@headlessui/react'
import BaseModal from './base-modal'
import { twMerge } from 'tailwind-merge'
import LoadingSpinner from 'shared/icon/loading-spinner'

type ModalOptionType = 'default' | 'confirm' | 'cancel'

type ModalOption = {
  text: string
  className?: string
  onClick(): void
  type?: ModalOptionType
  isLoading?: boolean
}

type ModalProps = {
  isOpen: boolean
  onClose?(): void
  headerIcon?: JSX.Element
  header?: string
  description?: string[]
  options?: ModalOption[]
  children?: React.ReactNode
  descriptionClassName?: string
}

export default function ActionModal({
  isOpen,
  headerIcon,
  header,
  description = [],
  options,
  children = null,
  descriptionClassName,
  onClose,
}: ModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {header && (
        <Dialog.Title as="h3" className="flex items-center text-lg font-medium leading-6 text-gray-900">
          {headerIcon} {header}
        </Dialog.Title>
      )}
      <div className={twMerge('mt-2', descriptionClassName)}>
        {description.map((descriptionParagraph, index) => (
          <p key={index} className="mb-1 text-sm text-gray-500">
            {descriptionParagraph}
          </p>
        ))}
        {children}
      </div>
      {options && (
        <div className="flex justify-between mt-4">
          {options?.map(({ text, onClick, className = '', type = 'default', isLoading = false }, index) => (
            <button
              key={index}
              type="button"
              className={twMerge(
                'inline-flex justify-center',
                'px-4 py-2',
                'rounded-md border border-transparent',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'text-sm font-medium ',
                type === 'default' && 'bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500 text-blue-900',
                type === 'confirm' && 'bg-blue-500 hover:bg-blue-700 text-white font-bold',
                type === 'cancel' && 'bg-red-500 hover:bg-red-700 text-white font-bold',
                className
              )}
              onClick={onClick}
            >
              {isLoading ? <LoadingSpinner /> : text}
            </button>
          ))}
        </div>
      )}
    </BaseModal>
  )
}
