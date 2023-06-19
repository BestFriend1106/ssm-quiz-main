import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { ExamFull } from './exam-domain'
import { plainToInstance } from 'class-transformer'
import { ExamRepository } from 'lib/repositories/exam-repository'
import { useFirestoreQuery } from '@react-query-firebase/firestore'

export const useAvailableExams = ({
  count,
  orderByField = 'updatedAt',
}: { count?: number; orderByField?: 'createdAt' | 'updatedAt' } = {}) => {
  const parseExamsSnapshot = (examsSnapshot: QuerySnapshot<DocumentData>) => {
    const exams = examsSnapshot?.docs.map((examSnapshot) => {
      const examData = examSnapshot.data() as ExamFull
      const exam = plainToInstance(ExamFull, examData)
      return exam
    })

    return exams ?? []
  }
  const {
    data: examsAvailable = [],
    isLoading: isLoadingAvailableExams,
    isFetching: isFetchingAvailableExams,
  } = useFirestoreQuery(
    ['available-exams'],
    ExamRepository.getAppNewExamsQuery({ orderByField, examsCount: count }),
    {},
    {
      select: parseExamsSnapshot,
    }
  )

  return { examsAvailable, isLoadingAvailableExams, isFetchingAvailableExams }
}
