import { TimeCountdownSection } from './time-countdown-section'
import { ExamResultsModal } from './exam-results-modal'
import { TopHeader } from './top-header'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { ExamTaken } from 'domain/exams/exam-domain'
import { useUserContext } from 'lib/userContext'
import { ExamTakenRepository } from 'lib/repositories/exam-taken-repository'
import { QuestionAlternative, QuestionWithAnswer } from 'domain/question'
import QuestionAlternativeCheckbox from 'shared/input/question-alternative'
import Body1 from 'shared/text/body1'
import LoadingSpinner from 'shared/icon/loading-spinner'
import { Routes } from 'lib/utils/routes'
import { ChevronLeftIcon, PauseIcon } from '@heroicons/react/24/solid'
import Countdown from 'react-countdown'
import { useBoolean } from 'lib/hooks/useBoolean'
import FileDisplayCard from 'shared/card/file-display-card'
import { ExamRankingRepository } from 'lib/repositories/exam-ranking-repository'
import { ExamRanking, UserExamResult } from 'domain/exams-ranking/exam-ranking-domain'
import { plainToInstance } from 'class-transformer'
import {
  FillingActionButtonDestructive,
  FillingActionButtonPrimary,
  FillingActionButtonSecondary,
} from './filling-action-button'
import { EndExamModal } from './end-exam-modal'
import ActionButton from 'shared/button/action'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

const ExamQuestionFillingPage = () => {
  const router = useRouter()
  const { firebaseUser, user } = useUserContext()

  const { examId, questionId, examTakenId } = router.query
  const [examTaken, setExamTaken] = useState<ExamTaken>()
  const [examRanking, setExamRanking] = useState<ExamRanking>()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isQuestionsSummaryOpen, setIsQuestionsSummaryOpen] = useState(false)

  const countdownRef = useRef<Countdown>(null)
  const {
    state: isFinishExamModalOpen,
    setTrue: openFinishExamModal,
    setFalse: closeFinishExamModal,
  } = useBoolean(false)

  const returnToExamDetails = () => router.replace({ pathname: Routes.appExamDetails, query: { examId } })
  const navigateToExamTakenCorrection = (examTakenId: string) =>
    router.push({ pathname: Routes.appExamCorrection, query: { examId, examTakenId } })

  const navigateToExamRanking = (examId: string) => router.push({ pathname: Routes.appExamRanking, query: { examId } })

  const { state: isExamResultsModalOpen, setTrue: openExamResultsModal } = useBoolean(false)

  const currentQuestion = examTaken?.questions[currentQuestionIndex]
  const questionAnswer = currentQuestion?.answer
  const totalQuestionsCount = examTaken?.questions.length ?? 0

  const updateQuestionIdOnURL = (questionId: string) =>
    router.push({ pathname: Routes.appExamFilling, query: { ...router.query, questionId } }, undefined, {
      shallow: true,
    })

  const updateQuestionAnswer = (questionIndex: number, answer: QuestionAlternative | null): QuestionWithAnswer[] => {
    if (!examTaken) return []
    const examTakenUpdated = { ...examTaken }
    const questionToUpdateAnswer = examTakenUpdated.questions[questionIndex]
    questionToUpdateAnswer.answer = answer

    setExamTaken(examTakenUpdated)
    return examTakenUpdated.questions
  }

  const navigateToSpecificQuestion = (questionIndex: number) => {
    if (questionIndex === currentQuestionIndex) return

    // On first rendering we have no examTaken, but still need to update current question index in case the question Id is provided in the URL query params
    const isIndexFromExistingQuestion = questionIndex < totalQuestionsCount || !examTaken
    if (isIndexFromExistingQuestion) {
      setCurrentQuestionIndex(questionIndex)
    }
  }

  useEffect(() => {
    if (!firebaseUser?.uid || !examId || typeof examId !== 'string') return

    const getExamTaken = async () => {
      let lastExamTaken
      if (examTakenId && typeof examTakenId === 'string') {
        lastExamTaken = await ExamTakenRepository.getExamTakenByIdForUser(examTakenId, firebaseUser.uid)
      }
      if (!lastExamTaken) {
        lastExamTaken = await ExamTakenRepository.getLastExamTakenForUserOnExamId(examId, firebaseUser.uid)
      }

      if (lastExamTaken && !lastExamTaken?.isStillRunning()) {
        navigateToExamTakenCorrection(lastExamTaken.id)
        return
      }
      setExamTaken(lastExamTaken)
      if (questionId && typeof questionId === 'string') {
        const questionIndex = lastExamTaken?.questions.findIndex((question) => question.id === questionId)
        if (questionIndex) navigateToSpecificQuestion(questionIndex)
        return
      }
      if (!questionId && lastExamTaken) {
        const firstQuestionId = lastExamTaken.questions[0].id
        updateQuestionIdOnURL(firstQuestionId)
      }
    }
    getExamTaken()
  }, [examId, firebaseUser?.uid])

  useEffect(() => {
    if (!currentQuestion) return
    updateQuestionIdOnURL(currentQuestion.id)
  }, [currentQuestion])

  if (!firebaseUser?.uid || !examTaken || !currentQuestion) return <LoadingSpinner />

  const answerQuestionUseCase = (questionIndex: number, jumpToNextQuestion = true) => {
    ExamTakenRepository.updateQuestionsAnswers(examTaken.questions, examTaken.id, firebaseUser.uid)
    if (!jumpToNextQuestion) return
    const isLastQuestion = currentQuestionIndex >= examTaken.questions.length - 1
    if (isLastQuestion) {
      openFinishExamModal()
      setIsQuestionsSummaryOpen(true)
      return
    }
    navigateToSpecificQuestion(questionIndex + 1)
  }

  const finishExamUseCase = async () => {
    const totalPoints = examTaken.totalPoints()
    const userExamResult = plainToInstance(UserExamResult, {
      userId: firebaseUser.uid,
      nickname: user?.nickname,
      profilePicture: firebaseUser.photoURL,
      points: totalPoints,
      ssmSubject: user?.ssmSubject,
      university: user?.university,
      city: user?.city,
    })
    await ExamTakenRepository.finishExam(examTaken.id, firebaseUser.uid, examTaken.questions, totalPoints)
    const updatedRanking = await ExamRankingRepository.addUserExamResultToRanking({
      examId: examTaken.examId,
      userResult: userExamResult,
    })
    if (updatedRanking) setExamRanking(updatedRanking)
    openExamResultsModal()
    countdownRef.current?.getApi().pause()
  }

  const onSelectAlternative = (alternative: QuestionAlternative) => {
    if (questionAnswer?.id === alternative.id) return
    updateQuestionAnswer(currentQuestionIndex, alternative)
  }

  return (
    <>
      <EndExamModal isOpen={isFinishExamModalOpen} onClose={closeFinishExamModal} onFinishExam={finishExamUseCase} />
      <ExamResultsModal
        isOpen={isExamResultsModalOpen}
        userId={firebaseUser.uid}
        examTaken={examTaken}
        examRanking={examRanking}
        onReturnToExamDetailsClick={returnToExamDetails}
        onGoToExamCorrectionClick={() => navigateToExamTakenCorrection(examTaken.id)}
        onGoToExamRankingClick={() => navigateToExamRanking(examTaken.examId)}
      />
      <div className="flex flex-col w-screen h-screen">
        <TopHeader />
        <TimeCountdownSection countdownRef={countdownRef} examTaken={examTaken} onTimeIsOver={finishExamUseCase} />
        <div className="flex flex-col flex-grow px-6 py-1 ">
          <div
            className={twMerge(
              'pr-3 border-[1.5px] border-[#d2d2d2] overflow-y-scroll',
              isQuestionsSummaryOpen && 'hidden'
            )}
          >
            <div
              className={classNames(
                'mt-3 ml-3 p-6 border-[1.5px] rounded-lg border-[#d2d2d2]',
                !!!currentQuestion.images && 'mb-3'
              )}
            >
              <Body1 className="text-base italic font-semibold">
                {`Domanda ${
                  currentQuestionIndex + 1
                }/${totalQuestionsCount}, Non Risposte ${examTaken.totalQuestionsWithoutAnswer()}/${totalQuestionsCount}`}
              </Body1>
              <Body1 className="mt-2 text-sm text-[#292B29]">{currentQuestion.description}</Body1>
            </div>
            {!!currentQuestion.images?.length && (
              <div className="flex flex-wrap gap-4 px-6 py-5">
                {currentQuestion.images?.map((image) => (
                  <FileDisplayCard key={image.fullPath} file={image} />
                ))}
              </div>
            )}
            {currentQuestion.alternatives.map((alternative, index) => (
              <QuestionAlternativeCheckbox
                key={alternative.id}
                index={index}
                text={alternative.text}
                isSelected={currentQuestion.answer?.id === alternative.id}
                onSelect={() => onSelectAlternative(alternative)}
              />
            ))}
          </div>
          <div className={twMerge('font-inter', !isQuestionsSummaryOpen && 'hidden')}>
            <Body1 className="text-base font-semibold text-[#4C4762]">
              Di seguito ti viene proposto il riepilogo della prova.
            </Body1>
            <Body1 className="text-[#3D2B00]">
              In corrispondenza delle domande in cui non hai fornito risposte trovi il pulsante "Vai alla domanda" per
              accedere direttamente al quesito relativo. Le domande in cui hai indicato una{' '}
              <span className="text-black text-bold">Presentano Invece</span> il pulsante "Modifica risposta" che
            </Body1>
            <div className="border-[1.5px] border-[#d2d2d2] overflow-y-scroll mt-4">
              {examTaken.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={classNames(
                    'grid grid-cols-2 py-4 px-4 md:px-20',
                    index % 2 === 0 ? 'bg-[#E1E1E1]' : 'bg-white'
                  )}
                >
                  <Body1 className="text-center font-inter text-[#2C2525]">
                    {index + 1}. {question.description}
                  </Body1>
                  <div className="flex items-center justify-center">
                    {question.hasValidAnswer() ? (
                      <FillingActionButtonDestructive
                        className="px-2 w-36"
                        label="MODIFICA RISPOSTA"
                        onClick={() => {
                          setIsQuestionsSummaryOpen(false)
                          navigateToSpecificQuestion(index)
                        }}
                      />
                    ) : (
                      <FillingActionButtonPrimary
                        className="px-2 w-36"
                        label="VAI ALLA DOMANDA"
                        onClick={() => {
                          setIsQuestionsSummaryOpen(false)
                          navigateToSpecificQuestion(index)
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 px-4 bg-white md:px-8">
          {isQuestionsSummaryOpen && (
            <div className="pt-3 text-center">
              <FillingActionButtonSecondary
                className="py-4"
                label={
                  <>
                    TERMINARE
                    <br />
                    L'ESAME
                  </>
                }
                onClick={openFinishExamModal}
              />
            </div>
          )}
          <div className={twMerge('flex justify-between gap-2 py-4 md:py-6', isQuestionsSummaryOpen && 'hidden')}>
            <FillingActionButtonPrimary
              label={
                <div className="relative flex items-center pl-10">
                  <ChevronLeftIcon className="absolute left-0 h-12" />
                  TORNA ALLA DOMANDA PRECEDENTE
                </div>
              }
              className="pl-0"
              disabled={currentQuestionIndex === 0}
              onClick={() => navigateToSpecificQuestion(currentQuestionIndex - 1)}
            />
            <FillingActionButtonPrimary
              label="CANCELA RISPOSTA"
              onClick={() => {
                updateQuestionAnswer(currentQuestionIndex, null)
                answerQuestionUseCase(currentQuestionIndex, false)
              }}
            />
            <FillingActionButtonPrimary
              label="VAI ALLA PAGINA DI RIEPILOGO"
              onClick={() => setIsQuestionsSummaryOpen(true)}
            />
            <FillingActionButtonSecondary
              label="CONFERMA E PROCEDI"
              disabled={questionAnswer === undefined}
              onClick={() => answerQuestionUseCase(currentQuestionIndex)}
            />
          </div>
          <div className="flex items-center justify-end gap-6 bg-[#F4FCFF] py-3">
            <ActionButton
              className="flex items-center gap-4 bg-[#369EC3] hover:bg-[#369EC3] border-[#369EC3] hover:border-[#369EC3] py-3 px-4 font-semibold"
              onClick={() => router.push({ pathname: Routes.appExamDetails, query: { examId } })}
            >
              <ChevronLeftIcon className="w-auto h-5" />
              Torna alla homepage
            </ActionButton>
            <ActionButton
              disabled
              className="min-w-0 bg-[#369EC3] hover:bg-[#369EC3] border-[#369EC3] hover:border-[#369EC3] py-3 font-semibold"
            >
              <PauseIcon className="w-auto h-6" />
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExamQuestionFillingPage
