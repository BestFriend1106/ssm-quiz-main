import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'
import { ComponentWithChildren, IconComponent } from 'types'

export type DropdownMenuItemProps = {
  label: string
  Icon?: IconComponent
  onClick?(): void
}

type DropdownMenuProps = ComponentWithChildren & {
  items: DropdownMenuItemProps[]
}

const DropdownItem = ({ label, Icon, onClick }: DropdownMenuItemProps) => {
  return (
    <Menu.Item
      as="div"
      className={classNames(
        'group flex w-full items-center rounded-2xl px-2 py-2 text-sm cursor-pointer',
        'ui-active:bg-blue-500 ui-active:text-white ui-active:font-semibold ui-not-active:text-gray-900'
      )}
      onClick={onClick}
    >
      <>
        {Icon && <Icon className="w-5 h-5 mr-1" />}
        {label}
      </>
    </Menu.Item>
  )
}

const DropdownMenu = ({ children, items }: DropdownMenuProps) => {
  if (items.length === 0) return <>{children}</>
  return (
    <Menu as="div" className="relative grid text-right place-content-center">
      <Menu.Button>{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'absolute right-0 w-fit min-w-[120px] mt-12 origin-top-right',
            'bg-white divide-y divide-gray-100 rounded-2xl shadow-lg',
            'ring-1 ring-black ring-opacity-5 focus:outline-none'
          )}
        >
          {items.map((item) => (
            <DropdownItem key={item.label} {...item} />
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DropdownMenu
