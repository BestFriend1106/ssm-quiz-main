import { twMerge } from 'tailwind-merge'

type InputErrorMessageProps = { errorMessage: string; className?: string }

const InputErrorMessage = ({ errorMessage, className }: InputErrorMessageProps) => {
  return <span className={twMerge('text-xs text-red-400', className)}>{errorMessage}</span>
}

export default InputErrorMessage
