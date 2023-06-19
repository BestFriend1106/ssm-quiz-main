import ExamRankingPage from 'app/exams/ranking-page'
import { NextPageWithAuth } from 'types'

const ExamRanking: NextPageWithAuth = () => {
  return <ExamRankingPage />
}

ExamRanking.requireUserAuth = true
export default ExamRanking
