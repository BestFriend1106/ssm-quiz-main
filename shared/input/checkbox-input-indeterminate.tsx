import { useRef, HTMLProps, useEffect } from 'react'
import classNames from 'classnames'

type IndeterminateCheckboxProps = HTMLProps<HTMLInputElement> & {
  indeterminate?: boolean
}

const IndeterminateCheckbox = ({ indeterminate, className = '', ...rest }: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={classNames(
        'cursor-pointer rounded-md border-blue-100 border-2 text-blue-500 focus:ring-blue-200',
        className
      )}
      {...rest}
    />
  )
}

export default IndeterminateCheckbox
