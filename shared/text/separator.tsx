import classNames from 'classnames'

type SeparatorProps = {
  text?: string
  className?: string
}

const Separator = ({ text, className = '' }: SeparatorProps) => {
  return (
    <div
      className={classNames(
        'text-slate-500',
        'flex items-center',
        'before:h-[1px] before:bg-slate-300 before:flex-grow',
        'after:h-[1px] after:bg-slate-300 after:flex-grow',
        text && 'before:mr-4 after:ml-4',
        className
      )}
    >
      {text}
    </div>
  )
}

export default Separator
