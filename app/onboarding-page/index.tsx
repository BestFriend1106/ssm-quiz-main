import { useState } from 'react'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import AcademicCapIcon from '@heroicons/react/24/outline/AcademicCapIcon'
import TestDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon'
import classNames from 'classnames'
import NameStep from './name-step'
import { ActionButtonSecondary } from 'shared/button/action'
import SubmitButton from 'shared/button/submit'
import { ActionButtonsProps, Step } from './types'
import EducationStep from './education-step'
import SSMStep from './ssm-step'
import { IconComponent } from 'types'

const StepIcon = ({
  Icon,
  title,
  isActive = false,
  disabled = true,
  showConnector = true,
}: {
  Icon: IconComponent
  title: string
  isActive: boolean
  disabled: boolean
  showConnector?: boolean
}) => {
  const borderColor = disabled ? 'border-gray-300' : 'border-blue-600'
  return (
    <>
      {showConnector && (
        <div
          className={classNames('flex-auto', 'transition duration-500 ease-in-out', 'border-t-2', borderColor)}
        ></div>
      )}
      <div className="relative flex items-center text-white">
        <div
          className={classNames(
            'grid place-content-center',
            'h-12 w-12',
            isActive && 'shadow-slate-500 shadow-md',
            'border-2',
            borderColor,
            !isActive && !disabled && 'bg-blue-600',
            'rounded-full',
            'transition duration-500 ease-in-out'
          )}
        >
          <Icon
            className={classNames(
              'w-6 h-6',
              disabled && 'text-gray-400',
              !isActive && !disabled && 'text-white',
              isActive && !disabled && 'text-blue-600'
            )}
          />
        </div>
        <div
          className={classNames(
            'absolute top-0 -ml-10 mt-14 w-32',
            'text-center text-xs font-medium uppercase',
            disabled ? 'text-gray-500' : 'text-blue-600'
          )}
        >
          {title}
        </div>
      </div>
    </>
  )
}

const steps: Step[] = [
  {
    title: 'Nome',
    icon: UserIcon,
    content: NameStep,
  },
  {
    title: 'Formazione',
    icon: AcademicCapIcon,
    content: EducationStep,
  },
  {
    title: 'SSM',
    icon: TestDocumentIcon,
    content: SSMStep,
  },
]

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const goToNextStep = () => !isLastStep && setCurrentStep((prev) => prev + 1)
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1)

  const CurrentStepContent = steps[currentStep].content
  const actionButtons = ({ onSubmit, isSubmitting = false }: ActionButtonsProps) => {
    return (
      <div className={classNames('flex mt-4', isFirstStep ? 'justify-end' : 'justify-between')}>
        {!isFirstStep && <ActionButtonSecondary onClick={goToPreviousStep}>Precedente</ActionButtonSecondary>}
        <SubmitButton onClick={onSubmit} isLoading={isSubmitting}>
          {isSubmitting && 'Loading...'}
          {isLastStep ? 'Inviare' : 'Prossimo'}
        </SubmitButton>
      </div>
    )
  }
  return (
    <div className="px-4 pt-4">
      <>
        <div className="px-6 mb-12">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <StepIcon
                key={index}
                Icon={step.icon}
                title={step.title}
                isActive={index === currentStep}
                disabled={index > currentStep}
                showConnector={index !== 0}
              />
            ))}
          </div>
        </div>
        {CurrentStepContent && <CurrentStepContent actionButtons={actionButtons} sendToNextStep={goToNextStep} />}
      </>
    </div>
  )
}

export default OnboardingPage
