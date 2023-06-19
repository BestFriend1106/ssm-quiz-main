import { twMerge } from 'tailwind-merge'

interface SectionTitleProps extends React.ComponentProps<'h3'> {}

export default function SectionTitle({ children, className = '', ...props }: SectionTitleProps) {
  return (
    <h3 className={twMerge('text-slate-600 font-semibold text-2xl', className)} {...props}>
      {children}
    </h3>
  )
}
