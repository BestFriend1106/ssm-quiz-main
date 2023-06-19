import LoadingSpinner from '../icon/loading-spinner'

type SubmitButtonProps = React.ComponentProps<'button'> & {
  isLoading?: boolean
}

function SubmitButton({ children, className = '', isLoading = false, ...props }: SubmitButtonProps) {
  const buttonContent = isLoading ? <LoadingSpinner /> : children

  return (
    <button
      type="submit"
      className={`
        px-4 py-2 min-w-[9rem]  min-h-[3rem]
        flex justify-center items-center
        bg-blue-500 hover:bg-blue-700 
        text-white font-bold 
        rounded-md 
        ${className}
        `}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export default SubmitButton
