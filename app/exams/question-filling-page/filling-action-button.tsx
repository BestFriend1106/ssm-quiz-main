import ActionButton from 'shared/button/action'
import { twMerge } from 'tailwind-merge'

type FillingButtonProps = {
  label: string | JSX.Element
  onClick?(): void
  disabled?: boolean
  className?: string
}

export const FillingActionButtonPrimary = ({ label, onClick, className, disabled = false }: FillingButtonProps) => {
  return (
    <ActionButton
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        'font-poppins font-semibold enabled:bg-gradient-to-b enabled:from-[#369EC3] enabled:to-[#2B6D85] w-44 text-sm border-0 py-3 rounded-xl',
        className
      )}
    >
      {label}
    </ActionButton>
  )
}

export const FillingActionButtonSecondary = ({ className, ...props }: FillingButtonProps) => {
  const consolidatedClassName = twMerge(className, 'enabled:from-[#D58A13] enabled:to-[#8A5728]')
  return <FillingActionButtonPrimary {...props} className={consolidatedClassName} />
}

export const FillingActionButtonDestructive = ({ className, ...props }: FillingButtonProps) => {
  const consolidatedClassName = twMerge(className, 'enabled:from-[#D71E60] enabled:to-[#7D204C]')
  return <FillingActionButtonPrimary {...props} className={consolidatedClassName} />
}
