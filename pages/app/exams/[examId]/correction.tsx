import ExamCorrectionPage from 'app/exams/correction-page'
import { NextPageWithAuth } from 'types'

const ExamCorrection: NextPageWithAuth = () => {
  return <ExamCorrectionPage />
}

ExamCorrection.requireUserAuth = true
export default ExamCorrection
