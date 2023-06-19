import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { QuestionFull, QuestionType } from 'domain/question'
import CreateOrEditQuestionPage from './create-or-edit-question-page'
import { useUserContext } from 'lib/userContext'
import { QuestionRepository } from 'lib/repositories/question-repository'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import ActionModal from 'shared/overlay/action-modal'
import useModal from 'shared/overlay/use-modal'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ActionButtonDestructive } from 'shared/button/action'
import QuestionsPageContent from './questions-page-content'

const AdminQuestionsPage = () => {
  const [isQuestionInfoOpen, setIsQuestionInfoOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<QuestionFull | null>(null)

  const { firebaseUser } = useUserContext()
  const openQuestionsInfo = (question?: QuestionFull) => {
    setActiveQuestion(question ?? null)
    setIsQuestionInfoOpen(true)
  }
  const closeQuestionsInfo = () => {
    setIsQuestionInfoOpen(false)
    setActiveQuestion(null)
  }

  const { data: questions = [], isLoading: isLoadingQuestions } = useFirestoreQuery(
    ['questions'],
    QuestionRepository.getAdminQuestionsSubscriptionQuery(firebaseUser?.uid),
    {
      subscribe: true,
    },
    {
      select(questionsSnapshot) {
        const questions = questionsSnapshot?.docs.map((questionSnapshot) => {
          const { type = QuestionType.Closed, ...questionData } = questionSnapshot.data() as QuestionFull
          return { type, ...questionData }
        })

        return questions ?? []
      },
    }
  )
  const {
    isOpen: isDeleteQuestionModalOpen,
    openModal: openDeleteQuestionModal,
    closeModal: closeDeleteQuestionModal,
  } = useModal()

  const onDeleteQuestion = (question: QuestionFull) => {
    setActiveQuestion(question)
    openDeleteQuestionModal()
  }

  const deleteActiveQuestion = async () => {
    if (!activeQuestion || !firebaseUser?.uid) return
    await QuestionRepository.deleteQuestion(activeQuestion, firebaseUser?.uid)
    closeDeleteQuestionModal()
  }

  return (
    <>
      <ActionModal
        header="Remove domanda"
        description={['Sei sicuro di voler eliminare la domanda?', 'Questa operazione non può essere ripristinata']}
        isOpen={isDeleteQuestionModalOpen}
        onClose={closeDeleteQuestionModal}
      >
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <Body1>Pubblicata</Body1>
            <Body2>{activeQuestion?.isPublished ? 'Sì' : 'No'}</Body2>
          </div>
          <div>
            <Body1>Item</Body1>
            <Body2>{activeQuestion?.item}</Body2>
          </div>
          <div>
            <Body1>Descrizione</Body1>
            <Body2>{activeQuestion?.description}</Body2>
          </div>

          <div className="grid w-full grid-cols-[2fr_5fr]">
            <Body1 className="w-full col-span-2">Alternatives</Body1>
            <Body1 className="italic font-normal">È corretta?</Body1>
            <Body1 className="italic font-normal">Testo</Body1>
            {activeQuestion?.alternatives.map((alternative, index) => (
              <Fragment key={index}>
                <Body1 className="mr-2 text-center">
                  {alternative.isCorrect ? <CheckCircleIcon className="w-5 h-5 ml-5 text-green-500" /> : ''}
                </Body1>
                <Body2 className="truncate">{alternative.text}</Body2>
              </Fragment>
            ))}
          </div>
          <ActionButtonDestructive onClick={deleteActiveQuestion}>Remove</ActionButtonDestructive>
        </div>
      </ActionModal>

      <Transition
        appear
        show={isQuestionInfoOpen}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="w-0 opacity-0"
        enterTo="w-full opacity-100"
        leave="ease-in duration-200"
        leaveFrom="w-full opacity-100"
        leaveTo="w-0 opacity-0"
      >
        <div className="p-4">
          <CreateOrEditQuestionPage onClose={closeQuestionsInfo} question={activeQuestion} />
        </div>
      </Transition>
      {
        <div className={classNames('p-4', isQuestionInfoOpen && 'hidden')}>
          <QuestionsPageContent
            questions={questions}
            isLoading={isLoadingQuestions}
            onOpenQuestionInfo={openQuestionsInfo}
            onDeleteQuestion={onDeleteQuestion}
          />
        </div>
      }
    </>
  )
}

export default AdminQuestionsPage
