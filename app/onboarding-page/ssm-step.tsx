import { useForm } from 'react-hook-form'
import { useUserContext } from 'lib/userContext'
import { UserRepository } from 'lib/repositories/user-repository'
import { StepContentComponent } from './types'

import AutocompleteInput from 'shared/input/autocomplete-input'
import { ssmSubjects } from './autocomplete-options'
import CheckboxInput from 'shared/input/checkbox-input'
type SSMStepData = {
  subject: string
  terms: boolean
  dataUsage: boolean
}

const SSMStep: StepContentComponent = ({ actionButtons, sendToNextStep }) => {
  const { firebaseUser } = useUserContext()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SSMStepData>()

  const onSubmitStep = async (data: SSMStepData) => {
    if (!firebaseUser || !data.subject) return

    await UserRepository.updateUser({
      userId: firebaseUser.uid,
      dataToUpdate: { ssmSubject: data.subject, isOnboarded: true },
    })

    sendToNextStep?.()
  }

  const onSubmit = handleSubmit(onSubmitStep)

  return (
    <form onSubmit={onSubmit}>
      <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-600 uppercase">Tema SSM</div>

      <AutocompleteInput
        name="subject"
        rules={{ required: 'Seleziona un tema' }}
        control={control}
        options={ssmSubjects}
        placeholder="SSM che voglio"
        errorMessage={errors.subject?.message}
      />
      <CheckboxInput
        label="Accetto i Termini d'uso (EULA) di SSM Quiz"
        errorMessage={errors.terms?.message}
        className="mt-4"
        {...register('terms', {
          required: 'È richiesto questo campo',
        })}
      />
      <CheckboxInput
        label="Inviando il modulo, accetto che i dati compilati siano salvati per migliorare la mia esperienza su SSM Quiz"
        errorMessage={errors.dataUsage?.message}
        {...register('dataUsage', {
          required: 'È richiesto questo campo',
        })}
      />
      {actionButtons({
        onSubmit,
        isSubmitting,
      })}
    </form>
  )
}

export default SSMStep
