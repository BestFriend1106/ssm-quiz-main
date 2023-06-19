import { useRef, useState } from 'react'
import { ComponentWithChildren } from 'types'
import Body2 from 'shared/text/body2'
import { Float, FloatProps } from '@headlessui-float/react'
import { twMerge } from 'tailwind-merge'

type TooltipProps = ComponentWithChildren & {
  children: JSX.Element
  content?: string | JSX.Element
  show?: boolean
  placement?: FloatProps['placement']
  arrowClassName?: string
  translateX?: number
}

const Tooltip = ({ children, content, show = true, arrowClassName = '', translateX = 0 }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (!show) return
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setIsOpen(true)
  }

  const delayClose = () => {
    if (!isOpen) return
    timer.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  if (!children) return null

  return (
    <>
      <Float show={isOpen} placement="bottom-start" offset={2} className="min-w-0">
        <div onMouseEnter={open} onMouseLeave={delayClose}>
          {children}
        </div>

        <div
          className={twMerge('relative max-w-xl bg-black rounded-md', `translate-x-[${translateX}px]`)}
          onMouseEnter={open}
          onMouseLeave={delayClose}
        >
          <Float.Arrow offset={2} className={twMerge('absolute w-2 h-2 rotate-45 bg-black left-2', arrowClassName)} />

          <div className="relative p-2 overflow-hidden bg-black rounded-md">
            <Body2 className="text-white break-all whitespace-pre-wrap">{content}</Body2>
          </div>
        </div>
      </Float>
    </>
  )
}
export default Tooltip
