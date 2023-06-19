import { useBoolean } from 'lib/hooks/useBoolean'
import { ComponentWithChildren } from 'types'
import AdminNavBar from './nav-bar'
import AdminSidebar from './sidebar'

type AdminLayoutProps = ComponentWithChildren & {
  title?: string
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { state: isCollapsedSidebar, toggle: toggleSidebarCollapse } = useBoolean(false)
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] antialiased bg-white text-black h-screen">
        <AdminSidebar isCollapsed={isCollapsedSidebar} />
        <div className="relative flex flex-col h-screen overflow-hidden">
          <AdminNavBar toggleSidebarCollapse={toggleSidebarCollapse} title={title} />
          <div className="relative flex-grow overflow-x-scroll overflow-y-scroll bg-blue-200 bg-opacity-30">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
