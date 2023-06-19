import React from 'react'
import ActionModal from 'shared/overlay/action-modal'

export function EndExamModal({
  isOpen,
  onClose,
  onFinishExam,
}: {
  isOpen: boolean
  onClose: () => void
  onFinishExam: () => Promise<void>
}) {
  return (
    <ActionModal
      header="Terminare l'esame"
      description={["Sei sicuro di voler completare l'esame?"]}
      isOpen={isOpen}
      onClose={onClose}
      options={[
        {
          type: 'confirm',
          text: 'Terminare',
          onClick: onFinishExam,
        },
        {
          type: 'cancel',
          text: 'Continua a rispondere',
          onClick: onClose,
        },
      ]}
    />
  )
}
