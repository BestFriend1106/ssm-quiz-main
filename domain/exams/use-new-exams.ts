import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { ExamFull } from './exam-domain'
import { plainToInstance } from 'class-transformer'
import { ExamRepository } from 'lib/repositories/exam-repository'
import { useFirestoreQuery } from '@react-query-firebase/firestore'

export const useNewExams = ({
  count = 10,
  filterByDiscipline,
  filterByItem,
}: { count?: number; filterByDiscipline?: string; filterByItem?: string } = {}) => {
  const parseExamsSnapshot = (examsSnapshot: QuerySnapshot<DocumentData>) => {
    const exams = examsSnapshot?.docs.map((examSnapshot) => {
      const examData = examSnapshot.data() as ExamFull
      const exam = plainToInstance(ExamFull, examData)
      return exam
    })

    return exams ?? []
  }
  const {
    data: newExams = [],
    isLoading: isLoadingNewExams,
    isFetching: isFetchingNewExams,
  } = useFirestoreQuery(
    ['new-exams', { filterByDiscipline, filterByItem }],
    ExamRepository.getAppNewExamsQuery({ examsCount: count, filterByDiscipline, filterByItem }),
    {},
    {
      select: parseExamsSnapshot,
    }
  )

  return { newExams, isLoadingNewExams, isFetchingNewExams }
}
