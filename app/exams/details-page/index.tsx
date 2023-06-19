import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ExamFull } from 'domain/exams/exam-domain'
import { useBoolean } from 'lib/hooks/useBoolean'
import { ExamRepository } from 'lib/repositories/exam-repository'
import { ExamTakenRepository } from 'lib/repositories/exam-taken-repository'
import { useUserContext } from 'lib/userContext'
import { Routes } from 'lib/utils/routes'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ActionButtonSecondary } from 'shared/button/action'
import SubmitButton from 'shared/button/submit'
import ExamResultTag from 'shared/card/exam-result-tag'
import StaticTag from 'shared/card/static-tag'
import LoadingSpinner from 'shared/icon/loading-spinner'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import SectionTitle from 'shared/text/section-title'
import { useExamsTakenFromUser } from '../useExamsTakenFromUser'
import ActionModal from 'shared/overlay/action-modal'
import { compareAsc } from 'date-fns'
import ExamItem from './exam-item'
import ExamResultsCard from './exam-results-card'
import { formatDate } from 'lib/utils/dates-formatter'
import { ClipboardDocumentListIcon as ExamsIcon } from '@heroicons/react/24/solid'
import { ExamRankingRepository } from 'lib/repositories/exam-ranking-repository'

const ExamDetailsPage = () => {
  const router = useRouter()
  const { examId } = router.query

  const { firebaseUser, user } = useUserContext()
  const { state: isCreatingExam, setTrue: startCreatingExam, setFalse: finishedCreatingExam } = useBoolean(false)
  const {
    state: isNewExamConfirmationModalOpen,
    setTrue: openNewExamConfirmationModal,
    setFalse: closeNewExamConfirmationModal,
  } = useBoolean(false)

  const { data: exam } = useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      if (!examId || typeof examId !== 'string') return
      return await ExamRepository.getAppExam(examId)
    },
    enabled: !!examId && typeof examId == 'string',
  })

  const { data: examRanking } = useQuery({
    queryKey: ['examRanking', examId],
    queryFn: async () => await ExamRankingRepository.getExamRankingByExamId(examId! as string),
    enabled: !!examId && typeof examId == 'string' && !!firebaseUser?.uid,
  })

  const {
    examsTaken: previouslyTakenExamsOrderedByCreatedAt,
    lastExamTaken,
    firstExamTaken,
    firstExamTakenScore,
    isFetching,
  } = useExamsTakenFromUser({
    examId: examId as string,
    userId: firebaseUser?.uid,
  })

  const navigateToExamFilling = (examTakenId: string) =>
    router.push({ pathname: Routes.appExamFilling, query: { examId, examTakenId } })

  const navigateToExamCorrection = (examTakenId: string) =>
    router.push({ pathname: Routes.appExamCorrection, query: { examId, examTakenId } })

  const navigateToExamRanking = (examId: string) => router.push({ pathname: Routes.appExamRanking, query: { examId } })

  const onStartNewExam = () => {
    if (!exam || !firebaseUser) return
    const isLastExamStillRunning = lastExamTaken?.isStillRunning()
    isLastExamStillRunning ? openNewExamConfirmationModal() : createNewExam(exam, firebaseUser.uid)
  }

  const createNewExam = async (exam: ExamFull, userId: string) => {
    startCreatingExam()
    const newExamTaken = await ExamTakenRepository.createExamTaken({ exam, userId, userNickname: user?.nickname })
    if (newExamTaken) navigateToExamFilling(newExamTaken.id)
    finishedCreatingExam()
  }

  const closePreviousExamAndStartNewOne = async () => {
    if (!lastExamTaken || !firebaseUser) return
    startCreatingExam()
    await ExamTakenRepository.finishExam(
      lastExamTaken.id,
      firebaseUser.uid,
      lastExamTaken.questions,
      lastExamTaken.totalPoints()
    )
    if (exam) await createNewExam(exam, firebaseUser.uid)
    finishedCreatingExam()
  }

  if (!exam || !firebaseUser) return <LoadingSpinner />

  const isUpdatedAtTheSameAsCreatedAt = () => {
    if (!exam.createdAt || !exam.updatedAt) return false
    const areTheDatesEqual = compareAsc(exam?.createdAt, exam.updatedAt) == 0
    return areTheDatesEqual
  }

  const examItems = exam.questions.reduce<string[]>((items, question) => {
    if (question.item && !items.includes(question.item)) {
      items.push(question.item)
    }
    return items
  }, [])

  return (
    <>
      <ActionModal
        header="Esame incompiuto"
        description={[
          'Sei sicuro di voler creare un nuovo esame?',
          "Quando ne crei uno nuovo, l'esame corrente sarà terminato",
        ]}
        isOpen={isNewExamConfirmationModalOpen}
        onClose={closeNewExamConfirmationModal}
        options={[
          { type: 'confirm', text: 'Nuovo esame', onClick: closePreviousExamAndStartNewOne, isLoading: isCreatingExam },
          {
            type: 'default',
            text: 'Continua a rispondere',
            onClick: () => lastExamTaken && navigateToExamFilling(lastExamTaken.id),
          },
        ]}
      />
      <div className="w-screen h-screen p-2 pb-10 overflow-y-hidden bg-blue-200 md:p-10 bg-opacity-30">
        <ArrowLeftIcon
          className="w-6 h-6 mb-2 cursor-pointer"
          onClick={() => router.push({ pathname: Routes.appHome })}
        />
        <div className="flex flex-col items-start w-full h-full gap-4 mx-auto overflow-y-scroll">
          <div className="flex justify-between w-full gap-4">
            <div className="flex items-center w-full gap-3 p-4 bg-white rounded-xl">
              <div className="grid bg-blue-500 rounded-lg h-14 aspect-square place-content-center">
                <ExamsIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-1 pb-2">
                <SectionTitle>{exam.title}</SectionTitle>
                <Body1 className="font-normal align-top">
                  <InformationCircleIcon className="self-start inline w-5 h-5 mr-1 -translate-y-[0.1rem] text-slate-600" />
                  {exam.description}
                </Body1>
              </div>
            </div>
            {firstExamTakenScore !== null && (
              <div className="p-4 bg-white rounded-xl min-w-[200px] flex flex-col items-center">
                <Body1 className="font-semibold text-md">Primo punteggio</Body1>
                {firstExamTaken?.createdAt && (
                  <Body2 className="mb-2">{formatDate(firstExamTaken.createdAt, 'human_readable_date')}</Body2>
                )}
                <div className="flex items-center justify-center h-full pb-2">
                  <ExamResultTag className="px-3 text-md" points={firstExamTakenScore} />
                </div>
              </div>
            )}
            {examRanking && (
              <div
                className="flex flex-col items-center p-4 bg-white cursor-pointer rounded-xl"
                onClick={() => navigateToExamRanking(examId as string)}
              >
                <Body1 className="font-semibold text-center text-md">Tua Posizione</Body1>
                <StaticTag className="mt-2 text-xl font-bold text-white bg-green-500">
                  # {examRanking.getUserPositionOnRanking(firebaseUser.uid)}
                </StaticTag>
              </div>
            )}
          </div>
          <div className="w-full justify-self-stretch">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <div className="flex flex-col p-4 bg-white rounded-xl">
                <Body1 className="mb-2 font-semibold text-md">Dettagli dell'esame</Body1>
                <StaticTag className="text-white bg-orange-400">{exam.questions.length} domande</StaticTag>
                {exam.createdAt && (
                  <div className="flex items-center gap-1 mt-2">
                    <Body2 className="italic">Messo online: </Body2>
                    <StaticTag className="bg-transparent border">
                      {formatDate(exam.createdAt, 'human_readable_datetime')}
                    </StaticTag>
                  </div>
                )}
                {exam.updatedAt && !isUpdatedAtTheSameAsCreatedAt() && (
                  <div className="flex items-center gap-1 mt-1">
                    <Body2 className="italic">Aggiornato il: </Body2>
                    <StaticTag className="bg-transparent border">
                      {formatDate(exam.updatedAt, 'human_readable_datetime')}
                    </StaticTag>
                  </div>
                )}
                <Body1 className="mt-4 font-medium">Temi</Body1>
                {examItems.map((item) => (
                  <ExamItem key={item} className="mt-2" examItem={item} />
                ))}
                {examItems.length === 0 && <Body2>L'esame non ha una descrizione del contenuto</Body2>}
              </div>
              <div className="flex flex-col gap-2 p-4 bg-white rounded-xl">
                <Body1 className="mb-2 font-semibold text-md">Resultati precedenti</Body1>
                {isFetching && <LoadingSpinner />}
                {previouslyTakenExamsOrderedByCreatedAt?.map(
                  (examTaken) =>
                    examTaken.createdAt && (
                      <ExamResultsCard
                        key={examTaken.id}
                        createdAt={examTaken.createdAt}
                        isStillRunning={examTaken.isStillRunning()}
                        points={examTaken.finalScore ?? examTaken.totalPoints()}
                        onClick={examTaken.isStillRunning() ? () => navigateToExamFilling(examTaken.id) : undefined}
                        onCorrectionClick={() => navigateToExamCorrection(examTaken.id)}
                      />
                    )
                )}
                {!previouslyTakenExamsOrderedByCreatedAt?.length && <Body2>Non hai mai sostenuto questo esame</Body2>}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 flex justify-around w-full p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.1)]">
            <SubmitButton isLoading={isCreatingExam} onClick={onStartNewExam}>
              Cominciare l'esame
            </SubmitButton>
            {lastExamTaken?.isStillRunning() && lastExamTaken.updatedAt && (
              <ActionButtonSecondary onClick={() => navigateToExamFilling(lastExamTaken.id)}>
                Continue l'esame
              </ActionButtonSecondary>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ExamDetailsPage
