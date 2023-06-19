import { useForm } from 'react-hook-form'
import { useUserContext } from 'lib/userContext'
import { UserRepository } from 'lib/repositories/user-repository'
import { StepContentComponent } from './types'

import AutocompleteInput from 'shared/input/autocomplete-input'
import { cities, universities } from './autocomplete-options'
type EducationStepData = {
  city: string
  university: string
}
const EducationStep: StepContentComponent = ({ actionButtons, sendToNextStep }) => {
  const { firebaseUser, user } = useUserContext()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<EducationStepData>({ defaultValues: { city: user?.city, university: user?.university } })

  const onSubmitStep = async (data: EducationStepData) => {
    if (!firebaseUser) return

    const hasDataChanged = data.city !== user?.city || data.university !== user?.university
    if (hasDataChanged) {
      await UserRepository.updateUser({ userId: firebaseUser.uid, dataToUpdate: data })
    }

    sendToNextStep?.()
  }

  const onSubmit = handleSubmit(onSubmitStep)

  return (
    <form onSubmit={onSubmit}>
      <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-600 uppercase">Città</div>

      <AutocompleteInput
        name="city"
        rules={{ required: true }}
        control={control}
        options={cities}
        placeholder="Seleziona una città"
      />
      <div className="h-6 mt-6 text-xs font-bold leading-8 text-gray-600 uppercase">Facoltà</div>
      <AutocompleteInput
        name="university"
        rules={{ required: true }}
        control={control}
        options={universities}
        placeholder="Seleziona una facoltà"
        className="mb-10"
      />
      {actionButtons({
        onSubmit,
        isSubmitting,
      })}
    </form>
  )
}

export default EducationStep
