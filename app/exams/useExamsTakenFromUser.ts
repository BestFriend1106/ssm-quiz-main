import { useFirestoreQuery } from '@react-query-firebase/firestore'
import { plainToInstance } from 'class-transformer'
import { ExamTaken } from 'domain/exams/exam-domain'
import { ExamTakenRepository } from 'lib/repositories/exam-taken-repository'
import { sortBy } from 'lodash'

type UseExamsTakenFromUserProps = {
  examId: string
  userId?: string
}

export const useExamsTakenFromUser = ({ examId, userId }: UseExamsTakenFromUserProps) => {
  const { data: examsTaken, isFetching } = useFirestoreQuery(
    ['examsTaken', { examId }],
    ExamTakenRepository.getExamsTakenForUserOnExamIdQuery(examId, userId),
    { subscribe: true },
    {
      enabled: !!examId && !!userId,
      select(examsTakenSnapshot) {
        const questions = examsTakenSnapshot?.docs.map((examTakenDocument) => {
          const examTakenDocumentData = examTakenDocument.data()
          return plainToInstance(ExamTaken, examTakenDocumentData)
        })

        return questions ?? []
      },
    }
  )

  const examsTakenOrderedByCreatedAt = sortBy(examsTaken, ['createdAt']).reverse()
  const mostRecentlyTakenExam = examsTakenOrderedByCreatedAt.length > 0 ? examsTakenOrderedByCreatedAt[0] : null
  const firstExamTaken =
    examsTakenOrderedByCreatedAt?.length > 0
      ? examsTakenOrderedByCreatedAt[examsTakenOrderedByCreatedAt?.length - 1]
      : null

  const firstExamTakenScore = firstExamTaken?.getExamScore() ?? null

  const examsThatEndedButWereNotFinished = examsTaken?.filter(
    (examTaken) => !examTaken.isStillRunning() && examTaken.isFinished === undefined
  )

  examsThatEndedButWereNotFinished?.forEach(
    (examTaken) =>
      userId && ExamTakenRepository.finishExam(examTaken.id, userId, examTaken.questions, examTaken.totalPoints())
  )

  return {
    examsTaken: examsTakenOrderedByCreatedAt,
    lastExamTaken: mostRecentlyTakenExam,
    firstExamTaken,
    firstExamTakenScore,
    isFetching,
  }
}
