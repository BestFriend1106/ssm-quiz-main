import { useBoolean } from 'lib/hooks/useBoolean'
import { ComponentWithChildren } from 'types'
import UserNavBar from './app-nav-bar'
import UserSidebar from './app-sidebar'

type UserLayoutProps = ComponentWithChildren & {
  title?: string
}

const UserLayout = ({ children, title }: UserLayoutProps) => {
  const { state: isCollapsedSidebar, toggle: toggleSidebarCollapse } = useBoolean(false)
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] antialiased bg-white text-black h-screen">
        <UserSidebar isCollapsed={isCollapsedSidebar} />
        <div className="relative flex flex-col h-screen overflow-hidden">
          <UserNavBar toggleSidebarCollapse={toggleSidebarCollapse} title={title} />
          <div className="relative flex-grow overflow-x-scroll overflow-y-scroll bg-blue-200 bg-opacity-30">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
