import SectionTitle from '../../shared/text/section-title'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import { ExamRepository } from '../../lib/repositories/exam-repository'
import { plainToInstance } from 'class-transformer'
import { ExamFull } from 'domain/exams/exam-domain'
import LoadingSpinner from 'shared/icon/loading-spinner'
import ExamCard from 'shared/card/exam'
import { useRouter } from 'next/router'
import { Routes } from 'lib/utils/routes'
import { useNewExams } from 'domain/exams/use-new-exams'
import { useAvailableExams } from 'domain/exams/use-available-exams'

export default function HomePage() {
  const router = useRouter()

  const { newExams, isLoadingNewExams } = useNewExams()
  const { examsAvailable, isLoadingAvailableExams } = useAvailableExams()

  const onClickExam = (examId: string) => router.push(`${Routes.appExams}/${examId}`)

  return (
    <div className="p-4">
      <SectionTitle>Nuovi esami</SectionTitle>
      {newExams.length === 0 && (
        <div className="grid p-2 place-items-center">
          {isLoadingNewExams ? <LoadingSpinner size={12} /> : 'Nessun nuovo esame disponibile'}
        </div>
      )}
      <div className="flex gap-2 pt-2 pb-4 overflow-x-scroll">
        {newExams.map((exam: ExamFull) => (
          <ExamCard
            key={exam.id}
            title={exam.title}
            description={exam.description}
            duration={exam.duration}
            questionsCount={exam.questions.length}
            disciplines={exam.getDisciplines()}
            onClick={() => onClickExam(exam.id)}
          />
        ))}
      </div>
      <SectionTitle className="mt-2">Esami Disponibili</SectionTitle>
      {examsAvailable.length === 0 && (
        <div className="grid p-2 place-items-center">
          {isLoadingAvailableExams ? <LoadingSpinner size={12} /> : 'Nessun esame disponibile'}
        </div>
      )}
      <div className="flex gap-2 pt-2 pb-4 overflow-x-scroll">
        {examsAvailable.map((exam: ExamFull) => (
          <ExamCard
            key={exam.id}
            title={exam.title}
            description={exam.description}
            duration={exam.duration}
            questionsCount={exam.questions.length}
            disciplines={exam.getDisciplines()}
            onClick={() => onClickExam(exam.id)}
          />
        ))}
      </div>
    </div>
  )
}
