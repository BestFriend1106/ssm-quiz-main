interface SubTitleProps extends React.ComponentProps<'h2'> {}

export default function SubTitle({ children, className, ...props }: SubTitleProps) {
  return (
    <h2 className={`text-slate-800 font-extrabold text-3xl ${className}`} {...props}>
      {children}
    </h2>
  )
}
