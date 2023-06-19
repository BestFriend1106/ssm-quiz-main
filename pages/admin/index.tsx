import AdminHomePage from 'app/admin/home'
import AdminLayout from 'shared/layout/admin-layout'
import { NextPageWithAuth } from 'types'

const AdminHome: NextPageWithAuth = () => {
  return (
    <AdminLayout>
      <AdminHomePage />
    </AdminLayout>
  )
}

AdminHome.requireAdminAuth = true
export default AdminHome
