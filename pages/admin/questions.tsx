import AdminLayout from 'shared/layout/admin-layout'
import AdminQuestionsPage from 'app/admin/questions-page'
import { NextPageWithAuth } from 'types'

const QuestionsHome: NextPageWithAuth = () => {
  return (
    <AdminLayout title="Domande">
      <AdminQuestionsPage />
    </AdminLayout>
  )
}

QuestionsHome.requireAdminAuth = true
export default QuestionsHome
