import { twMerge } from 'tailwind-merge'

interface StaticTagProps extends React.ComponentProps<'div'> {
  className?: string
}
const StaticTag = ({ children, className, style }: StaticTagProps) => {
  return (
    <div
      style={style}
      className={twMerge(
        'whitespace-nowrap px-2 py-0.5 rounded-full w-fit h-fit',
        'bg-gray-200 text-xs text-slate-500',
        className
      )}
    >
      {children}
    </div>
  )
}

export default StaticTag
