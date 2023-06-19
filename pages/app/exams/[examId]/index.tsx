import ExamHomePage from 'app/exams/exam-page'
import { NextPageWithAuth } from 'types'

const ExamHome: NextPageWithAuth = () => {
  return <ExamHomePage />
}

ExamHome.requireUserAuth = true
export default ExamHome
