import classNames from 'classnames'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import InputErrorMessage from './input-error-message'
import InputLabel from './input-label'

interface CheckboxInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string
  errorMessage?: string
  labelClassname?: string
  inputClassName?: string
}

const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  ({ label, className, inputClassName, labelClassname, errorMessage, ...props }, ref) => {
    return (
      <div className={twMerge('flex flex-col', !props.disabled && 'cursor-pointer', errorMessage && 'mb-2', className)}>
        <InputLabel
          className={classNames(
            'text-sm inline-flex items-center',
            !props.disabled && 'cursor-pointer',
            labelClassname
          )}
        >
          <div className="flex self-stretch">
            <input
              ref={ref}
              type="checkbox"
              className={twMerge(
                'h-4 w-4',
                'rounded-full',
                'shadow-md shadow-slate-100',
                'border-green-300 text-green-500 focus:ring-green-200',
                errorMessage && 'ring-red-500',
                inputClassName
              )}
              {...props}
            />
          </div>
          <span className={label && 'ml-2'}>{label}</span>
        </InputLabel>
        {errorMessage && <InputErrorMessage errorMessage={errorMessage} />}
      </div>
    )
  }
)

export default CheckboxInput
