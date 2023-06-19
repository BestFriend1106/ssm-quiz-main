import { twMerge } from 'tailwind-merge'
import { ComponentWithChildren } from 'types'

type InputLabelProps = ComponentWithChildren & { label?: string; className?: string }

const InputLabel = ({ children, className }: InputLabelProps) => {
  return <label className={twMerge('text-slate-500', className)}>{children}</label>
}

export default InputLabel
