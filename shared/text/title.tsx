interface TitleProps extends React.ComponentProps<'h1'> {}

export default function Title({ children, className = '', ...props }: TitleProps) {
  return (
    <h1 className={`text-slate-800 font-extrabold text-5xl ${className}`} {...props}>
      {children}
    </h1>
  )
}
