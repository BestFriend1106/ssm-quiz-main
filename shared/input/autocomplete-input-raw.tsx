import { useMemo } from 'react'
import { forwardRef, Fragment, useState } from 'react'
import classNames from 'classnames'

import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { twMerge } from 'tailwind-merge'
import InputLabel from './input-label'
import InputErrorMessage from './input-error-message'

type AutocompleteRawInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> & {
  errorMessage?: string
  options: string[]
  value: string
  onChange?(value: string): void
  isNullable?: boolean
}

const AutocompleteRawInput = forwardRef<HTMLInputElement, AutocompleteRawInputProps>(
  ({ options, className, errorMessage, placeholder = '', label, value, onChange, ...props }, ref) => {
    const optionsMemoized = useMemo(() => options, [options])

    const [optionQuery, setOptionQuery] = useState('')
    const filteredOptions =
      optionQuery === ''
        ? optionsMemoized
        : optionsMemoized.filter((option) =>
            option.toLowerCase().replace(/\s+/g, '').includes(optionQuery.toLowerCase().replace(/\s+/g, ''))
          )
    return (
      <div className={twMerge('relative', className)}>
        <Combobox nullable value={value} onChange={(value) => onChange?.(value ?? '')}>
          {label && <InputLabel>{label}</InputLabel>}
          <div
            className={classNames(
              'relative w-full cursor-default',
              'rounded-3xl bg-white shadow-md ',
              'text-left sm:text-sm'
            )}
          >
            <>
              <Combobox.Input
                ref={ref}
                className={twMerge(
                  'py-3 pl-5 pr-7 w-full rounded-[inherit] truncate',
                  'border-2 border-slate-200',
                  !errorMessage && 'focus:border-green-500',
                  errorMessage && 'focus:border-red-600',
                  'text-sm leading-5 text-gray-900 focus:ring-0'
                )}
                displayValue={(option: typeof value) => (!!option ? String(option) : '')}
                placeholder={placeholder}
                onChange={(event) => setOptionQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </>
          </div>
          {errorMessage && <InputErrorMessage errorMessage={errorMessage} />}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setOptionQuery('')}
          >
            <Combobox.Options
              className={classNames(
                'absolute mt-1 py-1 max-h-60 w-full z-10',
                'overflow-auto rounded-t-md rounded-b-2xl bg-white',
                'text-sm',
                'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              )}
            >
              {filteredOptions.length === 0 && optionQuery !== '' ? (
                <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                  Non abbiamo trovato nulla.
                </div>
              ) : (
                filteredOptions.map((option) => <AutocompleteOption key={option} option={option} />)
              )}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
    )
  }
)

type AutocompleteOptionProps = {
  option: string
}

const AutocompleteOption = ({ option }: AutocompleteOptionProps) => {
  const checkIcon = (isActive: boolean) => {
    return (
      <span
        className={classNames(
          'absolute inset-y-0 left-0 flex items-center pl-3',
          isActive ? 'text-white' : 'text-green-700'
        )}
      >
        <CheckIcon className="w-5 h-5" aria-hidden="true" />
      </span>
    )
  }
  return (
    <Combobox.Option
      className={({ active }) =>
        classNames(
          'relative cursor-default select-none py-2 pl-10 pr-4',
          active ? 'bg-green-600 text-white' : 'text-gray-900'
        )
      }
      value={option}
    >
      {({ selected, active }) => (
        <>
          <span
            className={classNames(
              'block truncate',
              selected ? 'font-bold' : 'font-normal',
              active && 'text-white font-semibold',
              selected && !active && 'text-green-700'
            )}
          >
            {option}
          </span>
          {selected && checkIcon(active)}
        </>
      )}
    </Combobox.Option>
  )
}

export default AutocompleteRawInput
