import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import CreateOrEditExamPage from './create-or-edit-exam-page'
import { useUserContext } from 'lib/userContext'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import ActionModal from 'shared/overlay/action-modal'
import useModal from 'shared/overlay/use-modal'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import { ActionButtonDestructive } from 'shared/button/action'
import { ExamFull } from 'domain/exams/exam-domain'
import { ExamRepository } from 'lib/repositories/exam-repository'
import ExamsPageContent from './exams-page-content'

const AdminExamsPage = () => {
  const [isExamInfoOpen, setIsExamInfoOpen] = useState(false)
  const [activeExam, setActiveExam] = useState<ExamFull | null>(null)

  const { firebaseUser } = useUserContext()
  const openExamsInfo = (exam?: ExamFull) => {
    setActiveExam(exam ?? null)
    setIsExamInfoOpen(true)
  }
  const closeExamsInfo = () => {
    setIsExamInfoOpen(false)
    setActiveExam(null)
  }

  const { data: exams = [], isLoading: isLoadingExams } = useFirestoreQuery(
    ['exams'],
    ExamRepository.getAdminExamsSubscriptionQuery(firebaseUser?.uid),
    {
      subscribe: true,
    },
    {
      select(examsSnapshot) {
        const exams = examsSnapshot?.docs.map((examSnapshot) => {
          const examData = examSnapshot.data() as ExamFull
          return examData
        })

        return exams ?? []
      },
    }
  )
  const { isOpen: isDeleteExamModalOpen, openModal: openDeleteExamModal, closeModal: closeDeleteExamModal } = useModal()

  const onDeleteExam = (exam: ExamFull) => {
    setActiveExam(exam)
    openDeleteExamModal()
  }

  const deleteActiveExam = async () => {
    if (!activeExam || !firebaseUser?.uid) return
    await ExamRepository.deleteExam(activeExam, firebaseUser?.uid)
    closeDeleteExamModal()
  }

  return (
    <>
      <ActionModal
        header="Remove esami"
        description={["Sei sicuro di voler eliminare l'esame?", 'Questa operazione non può essere ripristinata']}
        isOpen={isDeleteExamModalOpen}
        onClose={closeDeleteExamModal}
      >
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="w-full">
            <Body1>Titolo</Body1>
            <Body2>{activeExam?.title}</Body2>
          </div>
          <div className="w-full">
            <Body1>Descrizione</Body1>
            <Body2>{activeExam?.description}</Body2>
          </div>
          <div>
            <Body1>Durata</Body1>
            <Body2>{activeExam?.duration}</Body2>
          </div>
          <div>
            <Body1>Numero di domande</Body1>
            <Body2>{activeExam?.questions?.length}</Body2>
          </div>

          <ActionButtonDestructive className="basis-full w-fit" onClick={deleteActiveExam}>
            Remove
          </ActionButtonDestructive>
        </div>
      </ActionModal>

      <Transition
        appear
        show={isExamInfoOpen}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="w-0 opacity-0"
        enterTo="w-full opacity-100"
        leave="ease-in duration-200"
        leaveFrom="w-full opacity-100"
        leaveTo="w-0 opacity-0"
      >
        <div className="h-full p-4">
          <CreateOrEditExamPage onClose={closeExamsInfo} exam={activeExam} />
        </div>
      </Transition>
      {
        <div className={classNames('p-4', isExamInfoOpen && 'hidden')}>
          <ExamsPageContent
            exams={exams}
            isLoading={isLoadingExams}
            onOpenExamInfo={openExamsInfo}
            onDeleteExam={onDeleteExam}
          />
        </div>
      }
    </>
  )
}

export default AdminExamsPage
