import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import LoadingSpinner from 'shared/icon/loading-spinner'

type ActionButtonProps = React.ComponentProps<'button'> & {
  isLoading?: boolean
}

const ActionButton = ({ children, className, isLoading = false, ...props }: ActionButtonProps) => {
  const buttonContent = isLoading ? <LoadingSpinner /> : children
  return (
    <button
      className={twMerge(
        'px-4 py-2 min-w-[6rem]',
        'border-2 border-blue-500 hover:border-blue-700',
        'bg-blue-500 hover:bg-blue-700',
        'text-white font-bold',
        'rounded-md',
        'disabled:bg-slate-400 disabled:border-slate-400',
        className
      )}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export default ActionButton

export const ActionButtonSecondary = ({ children, className, isLoading = false, ...props }: ActionButtonProps) => {
  const buttonContent = isLoading ? <LoadingSpinner className="fill-blue-500" /> : children
  return (
    <button
      className={twMerge(
        'flex justify-center',
        'px-4 py-2 min-w-[6rem]',
        'border-2 border-blue-500',
        'bg-white hover:bg-blue-400',
        'text-blue-500 hover:text-white font-bold',
        'rounded-md',
        className
      )}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export const ActionButtonDestructive = ({ children, className, isLoading = false, ...props }: ActionButtonProps) => {
  const buttonContent = isLoading ? <LoadingSpinner /> : children
  return (
    <button
      className={classNames(
        className,
        'px-4 py-2 min-w-[6rem]',
        'border-2 border-red-500 hover:border-red-700',
        'bg-red-500 hover:bg-red-700',
        'text-white font-bold',
        'rounded-md'
      )}
      {...props}
    >
      {buttonContent}
    </button>
  )
}
