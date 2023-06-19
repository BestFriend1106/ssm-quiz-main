import AdminExamsPage from 'app/admin/exams-page'
import AdminLayout from 'shared/layout/admin-layout'
import { NextPageWithAuth } from 'types'

const ExamsHome: NextPageWithAuth = () => {
  return (
    <AdminLayout title="Esami">
      <AdminExamsPage />
    </AdminLayout>
  )
}

ExamsHome.requireAdminAuth = true
export default ExamsHome
