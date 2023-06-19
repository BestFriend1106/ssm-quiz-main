import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Body1Props extends React.ComponentProps<'h1'> {}

const Body1 = forwardRef<HTMLInputElement, Body1Props>(({ children, className = '', ...props }, ref) => {
  return (
    <p ref={ref} className={twMerge('text-slate-700 font-medium text-sm', className)} {...props}>
      {children}
    </p>
  )
})
export default Body1
