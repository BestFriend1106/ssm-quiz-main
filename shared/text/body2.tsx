import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Body2Props extends React.ComponentProps<'h1'> {}

const Body2 = forwardRef<HTMLInputElement, Body2Props>(({ children, className = '', ...props }, ref) => {
  return (
    <h1 ref={ref} className={twMerge('text-slate-700 font-normal text-xs', className)} {...props}>
      {children}
    </h1>
  )
})

export default Body2
