import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import InputErrorMessage from './input-error-message'
import InputLabel from './input-label'

interface MultilineMultilineTextInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  errorMessage?: string
  inputClassName?: string
}

const MultilineTextInput = forwardRef<HTMLTextAreaElement, MultilineMultilineTextInputProps>(
  ({ className, inputClassName, errorMessage, label, ...props }, ref) => {
    return (
      <div className={className}>
        <InputLabel>
          {label}
          <textarea
            ref={ref}
            className={twMerge(
              `py-3 px-6 w-full 
            border-1 border-black border-opacity-20 focus:ring-2 focus:ring-blue-700 focus:outline-none appearance-none 
            text-sm leading-6 text-slate-800 placeholder-slate-400 placeholder:italic
            rounded-md shadow-md shadow-slate-100`,
              errorMessage && 'ring-red-500',
              inputClassName
            )}
            {...props}
          />
        </InputLabel>
        {errorMessage && <InputErrorMessage errorMessage={errorMessage} />}
      </div>
    )
  }
)

export default MultilineTextInput
