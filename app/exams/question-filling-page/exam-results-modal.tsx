import { CORRECT_ANSWER_POINTS, ExamTaken, INCORRECT_ANSWER_POINTS } from 'domain/exams/exam-domain'
import Body1 from 'shared/text/body1'
import ActionButton, { ActionButtonDestructive, ActionButtonSecondary } from 'shared/button/action'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import ActionModal from 'shared/overlay/action-modal'
import Body2 from 'shared/text/body2'
import StaticTag from 'shared/card/static-tag'
import { PresentationChartLineIcon } from '@heroicons/react/24/outline'
import { ExamRanking } from 'domain/exams-ranking/exam-ranking-domain'

export const ExamResultsModal = ({
  isOpen,
  examRanking,
  userId,
  examTaken,
  onReturnToExamDetailsClick,
  onGoToExamCorrectionClick,
  onGoToExamRankingClick,
}: {
  isOpen: boolean
  userId: string
  examTaken: ExamTaken
  examRanking: ExamRanking | undefined
  onReturnToExamDetailsClick(): void
  onGoToExamCorrectionClick(): void
  onGoToExamRankingClick(): void
}) => {
  const totalQuestionsCount = examTaken.questions.length ?? 0
  const countOfCorrectAnswers = examTaken.questions.filter((question) => question.answer?.isCorrect).length
  const countOfIncorrectAnswers = examTaken.questions.filter((question) => question.answer?.isCorrect === false).length
  const countOfDontKnowAnswers = examTaken.questions.filter((question) => question.answer === null).length

  return (
    <ActionModal
      headerIcon={<PresentationChartLineIcon className="w-8 h-8 mr-2 text-slate-500" />}
      header="Risultato dell'esame"
      isOpen={isOpen}
    >
      {examRanking && (
        <Body1 className="flex items-center self-center justify-center w-full gap-4 p-4 bg-green-300 rounded-lg text-slate-600">
          <span className="w-2/5 text-lg font-bold">Posizione in graduatoria:</span>
          <div className="flex flex-col gap-1 text-center">
            <div className="flex items-center gap-1">
              <StaticTag className="font-bold text-green-600 bg-white border border-green-500 text-md">
                # {examRanking.getUserPositionOnRanking(userId)}
              </StaticTag>
              su
              <StaticTag className="font-bold text-green-600 bg-white border border-green-500 text-md">
                {examRanking.getUsersCount()}
              </StaticTag>
            </div>
            <span>{examRanking.getUsersCount() === 1 ? 'partecipante' : 'partecipanti'}</span>
          </div>
        </Body1>
      )}
      <div className="grid grid-cols-[auto_auto] gap-y-2 gap-x-4 w-fit mx-auto">
        <div className="flex items-center gap-2 mt-4">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <Body1 className="font-normal text-md">Correte</Body1>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Body2>
            {countOfCorrectAnswers} / {totalQuestionsCount}
          </Body2>
          <StaticTag className="font-semibold text-white bg-green-500">
            {countOfCorrectAnswers * CORRECT_ANSWER_POINTS} punti
          </StaticTag>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          <Body1 className="font-normal text-md">Sbagliate</Body1>
        </div>
        <div className="flex items-center gap-2 mt-1 ">
          <Body2>
            {countOfIncorrectAnswers} / {totalQuestionsCount}
          </Body2>
          <StaticTag className="font-semibold text-white bg-red-500">
            {countOfIncorrectAnswers * INCORRECT_ANSWER_POINTS} punti
          </StaticTag>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500" />
          <Body1 className="font-normal text-md">Non risponte</Body1>
        </div>
        <div className="flex items-center gap-2 mt-1 ">
          <Body2>
            {countOfDontKnowAnswers} / {totalQuestionsCount}
          </Body2>
          <StaticTag className="font-semibold text-white bg-blue-500">0 punti</StaticTag>
        </div>
        <hr className="col-span-2" />
        <Body1 className="ml-7 text-md">TOTALE: </Body1>
        <div className="flex items-center gap-2">
          <StaticTag>
            {countOfCorrectAnswers * CORRECT_ANSWER_POINTS + countOfIncorrectAnswers * INCORRECT_ANSWER_POINTS} punti
          </StaticTag>
        </div>
      </div>

      <div className="flex items-center justify-around gap-4 mt-4">
        <ActionButtonDestructive onClick={onReturnToExamDetailsClick}>Ritornare</ActionButtonDestructive>
        <ActionButton onClick={onGoToExamCorrectionClick}>Correzione</ActionButton>
        <ActionButtonSecondary onClick={onGoToExamRankingClick}>Graduatoria</ActionButtonSecondary>
      </div>
    </ActionModal>
  )
}
