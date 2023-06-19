import { Switch } from '@headlessui/react'
import { forwardRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import InputErrorMessage from './input-error-message'
import InputLabel from './input-label'

interface SwitchInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string
  errorMessage?: string
  labelClassname?: string
  inputClassName?: string
}

const SwitchInput = forwardRef<HTMLInputElement, SwitchInputProps>(
  ({ label, className, inputClassName, labelClassname, errorMessage, ...props }, ref) => {
    const [enabled, setEnabled] = useState(false)

    return (
      <>
        <InputLabel className={twMerge('flex cursor-pointer', errorMessage && 'mb-2', className)}>
          {label}
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={twMerge(
              'relative inline-flex h-6 w-11 items-center rounded-full ml-4',
              enabled ? 'bg-green-600' : 'bg-gray-200',
              inputClassName
            )}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </InputLabel>
        {errorMessage && <InputErrorMessage errorMessage={errorMessage} />}
      </>
    )
  }
)

export default SwitchInput
