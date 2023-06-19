import ExamDetailsPage from 'app/exams/details-page'
import { NextPageWithAuth } from 'types'

const ExamDetails: NextPageWithAuth = () => {
  return <ExamDetailsPage />
}

ExamDetails.requireUserAuth = true
export default ExamDetails
