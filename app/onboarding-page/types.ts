import { FunctionComponent } from 'react'
import { IconComponent } from 'types'

export type ActionButtonsProps = {
  onSubmit: () => Promise<void>
  isSubmitting?: boolean
}

export type StepContentComponentProps = {
  actionButtons: (props: ActionButtonsProps) => JSX.Element
  sendToNextStep?(): void
}

export type StepContentComponent = FunctionComponent<StepContentComponentProps>

export type Step = {
  title: string
  icon: IconComponent
  content: StepContentComponent | null
}
