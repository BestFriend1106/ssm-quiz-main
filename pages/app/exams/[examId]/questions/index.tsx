import ExamQuestionFillingPage from 'app/exams/question-filling-page'
import { NextPageWithAuth } from 'types'

const ExamQuestionFilling: NextPageWithAuth = () => {
  return <ExamQuestionFillingPage />
}

ExamQuestionFilling.requireUserAuth = true
export default ExamQuestionFilling
