import { useRouter } from 'next/router'
import { useUserContext } from 'lib/userContext'
import { ExamTakenRepository } from 'lib/repositories/exam-taken-repository'
import SectionTitle from 'shared/text/section-title'
import Body1 from 'shared/text/body1'
import LoadingSpinner from 'shared/icon/loading-spinner'
import { Routes } from 'lib/utils/routes'
import { ArrowLeftIcon, QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { useQuery } from 'react-query'
import QuestionCorrectionCard from './question-correction-card'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Body2 from 'shared/text/body2'
import StaticTag from 'shared/card/static-tag'
import ExamResultTag from 'shared/card/exam-result-tag'
import { formatDate } from 'lib/utils/dates-formatter'
import classNames from 'classnames'
import { useEffect } from 'react'

const ExamCorrectionPage = () => {
  const router = useRouter()
  const { firebaseUser } = useUserContext()

  const { examId, examTakenId } = router.query

  const { data: examTaken } = useQuery({
    queryKey: ['examTaken', examTakenId],
    queryFn: async () => await ExamTakenRepository.getExamTakenByIdForUser(examTakenId! as string, firebaseUser!.uid),
    enabled: !!examTakenId && typeof examTakenId == 'string' && !!firebaseUser?.uid,
  })

  useEffect(() => {
    if (!examTaken) return
    if (examTaken?.isStillRunning()) {
      router.replace({ pathname: Routes.appExamFilling, query: { examId, examTakenId } })
    }
  }, [examTaken])

  if (!firebaseUser?.uid || !examTaken || examTaken?.isStillRunning()) return <LoadingSpinner />

  const totalQuestionsCount = examTaken.questions.length ?? 0
  const countOfCorrectAnswers = examTaken.questions.filter((question) => question.answer?.isCorrect).length
  const countOfIncorrectAnswers = examTaken.questions.filter((question) => question.answer?.isCorrect === false).length
  const countOfDontKnowAnswers = examTaken.questions.filter((question) => question.answer === null).length

  return (
    <>
      <div className="w-screen h-screen p-2 overflow-y-scroll bg-blue-200 md:p-10 bg-opacity-30">
        <div className="flex flex-col items-start w-full gap-2 mx-auto">
          <ArrowLeftIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => router.push({ pathname: Routes.appExamDetails, query: { examId } })}
          />
          <div className="grid grid-cols-2 sm:grid-cols-[1fr_4fr_2fr] w-full gap-4">
            <ScoreBlock score={examTaken.getExamScore()} className="order-1 " />
            <ExamDetailsBlock
              examTitle={examTaken.title}
              numberOfQuestions={examTaken.questions.length}
              responseDate={examTaken.createdAt}
              className="order-3 col-span-2 sm:order-2 sm:col-span-1"
            />
            <ExamQuestionsSummaryBlock
              numberOfQuestions={totalQuestionsCount}
              numberOfCorrectAnswers={countOfCorrectAnswers}
              numberOfIncorrectAnswers={countOfIncorrectAnswers}
              numberOfDontKnowAnswers={countOfDontKnowAnswers}
              className="order-2 sm:order-3"
            />
          </div>
          <div className="w-full mt-2 justify-self-stretch">
            {examTaken.questions.map((question, index) => (
              <QuestionCorrectionCard key={question.id} question={question} questionIndex={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ExamCorrectionPage

const ScoreBlock = ({ score, className }: { score: number; className?: string }) => (
  <div className={classNames('flex flex-col items-center p-4 bg-white rounded-xl', className)}>
    <Body1 className="text-lg font-semibold">Risultato</Body1>
    <div className="flex items-center justify-center h-full pb-2">
      <ExamResultTag className="px-3 text-md" points={score} />
    </div>
  </div>
)

const ExamDetailsBlock = ({
  examTitle,
  numberOfQuestions,
  responseDate,
  className,
}: {
  examTitle: string
  numberOfQuestions: number
  responseDate?: Date
  className?: string
}) => (
  <div className={classNames('p-4 bg-white rounded-xl', className)}>
    <Body1>Esami</Body1> <SectionTitle>{examTitle}</SectionTitle>
    <StaticTag className="mt-4 text-white bg-orange-400">{numberOfQuestions} domande</StaticTag>
    {responseDate && (
      <div className="flex items-center gap-1 mt-2">
        <Body2 className="italic">Esame risposto in: </Body2>
        <StaticTag className="bg-transparent border">{formatDate(responseDate, 'human_readable_datetime')}</StaticTag>
      </div>
    )}
  </div>
)

const ExamQuestionsSummaryBlock = ({
  numberOfQuestions,
  numberOfCorrectAnswers,
  numberOfIncorrectAnswers,
  numberOfDontKnowAnswers,
  className,
}: {
  numberOfQuestions: number
  numberOfCorrectAnswers: number
  numberOfIncorrectAnswers: number
  numberOfDontKnowAnswers: number
  className?: string
}) => (
  <div className={classNames('grid items-center grid-cols-[1fr_auto] p-4 bg-white rounded-xl gap-y-2', className)}>
    <div className="flex items-center gap-2">
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
      <Body1 className="font-normal text-md">Correte</Body1>
    </div>
    <div className="flex items-center">
      <Body2>
        {numberOfCorrectAnswers} / {numberOfQuestions}
      </Body2>
    </div>
    <div className="flex items-center gap-2">
      <XCircleIcon className="w-5 h-5 text-red-500" />
      <Body1 className="font-normal text-md">Sbagliate</Body1>
    </div>
    <div className="flex items-center gap-2">
      <Body2>
        {numberOfIncorrectAnswers} / {numberOfQuestions}
      </Body2>
    </div>
    <div className="flex items-center gap-2">
      <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500" />
      <Body1 className="font-normal text-md">Non risponte</Body1>
    </div>
    <div className="flex items-center gap-2">
      <Body2>
        {numberOfDontKnowAnswers} / {numberOfQuestions}
      </Body2>
    </div>
  </div>
)
