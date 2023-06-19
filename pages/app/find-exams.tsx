import { NextPageWithAuth } from 'types'
import AppLayout from 'shared/layout/app-layout'
import FindExamsPage from 'app/find-exam'

const FindExams: NextPageWithAuth = () => {
  return (
    <AppLayout title="Trova Esami">
      <FindExamsPage />
    </AppLayout>
  )
}

FindExams.requireUserAuth = true
export default FindExams
