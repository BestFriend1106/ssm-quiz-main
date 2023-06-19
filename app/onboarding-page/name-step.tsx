import { useForm } from 'react-hook-form'
import { useUserContext } from 'lib/userContext'
import { UserRepository } from 'lib/repositories/user-repository'
import TextInput from 'shared/input/text-input'
import { StepContentComponent } from './types'

type NameStepData = {
  name: string
  surname: string
  nickname: string
}

const NameStep: StepContentComponent = ({ actionButtons, sendToNextStep }) => {
  const { firebaseUser, user } = useUserContext()
  const [initialName, ...initialSurnames] = firebaseUser?.displayName?.split(' ') ?? ['', '']
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NameStepData>({
    defaultValues: { name: initialName, surname: initialSurnames.join(' '), nickname: user?.nickname },
  })

  const onSubmitStep = async (data: NameStepData) => {
    if (!firebaseUser?.uid) return

    const isNicknameAvailable = await UserRepository.isNicknameAvailable({
      userId: firebaseUser.uid,
      nickname: data.nickname,
    })
    if (!isNicknameAvailable) {
      setError('nickname', { type: 'custom', message: 'Il nickname è già in uso' })
      return
    }
    const newName = `${data.name} ${data.surname}`
    const hasNameChanged = firebaseUser?.displayName !== newName
    if (hasNameChanged) {
      await UserRepository.updateUserDisplayName({ user: firebaseUser, newName })
    }
    const hasNicknameChanged = user?.nickname !== data.nickname
    if (hasNicknameChanged) {
      await UserRepository.registerUserNickname({ userId: firebaseUser.uid, nickname: data.nickname })
    }

    sendToNextStep?.()
  }

  const onSubmit = handleSubmit(onSubmitStep)

  return (
    <form onSubmit={onSubmit}>
      <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-600 uppercase">Cognome</div>
      <TextInput
        type="text"
        className="mt-2"
        aria-label="Cognome"
        placeholder="Tuo cognome"
        errorMessage={errors.surname?.message}
        {...register('surname', {
          required: 'Il tuo cognome deve contenere almeno 3 caratteri',
          minLength: { value: 3, message: 'Il tuo cognome deve contenere almeno 3 caratteri' },
        })}
      />
      <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-600 uppercase">Nome</div>
      <TextInput
        type="text"
        className="mt-2"
        aria-label="Nome"
        placeholder="Tuo nome"
        errorMessage={errors.name?.message}
        {...register('name', {
          required: 'Il tuo nome deve contenere almeno 3 caratteri',
          minLength: { value: 3, message: 'Il tuo nome deve contenere almeno 3 caratteri' },
        })}
      />
      <div className="h-6 mt-3 text-xs font-bold leading-8 text-gray-600 uppercase">Nickname</div>
      <TextInput
        type="text"
        className="mt-2"
        aria-label="Nome"
        placeholder="Tuo nickname"
        errorMessage={errors.nickname?.message}
        {...register('nickname', {
          required: 'Il tuo nickname deve contenere almeno 3 caratteri',
          minLength: { value: 3, message: 'Il tuo nickname deve contenere almeno 3 caratteri' },
        })}
      />
      {actionButtons({
        onSubmit,
        isSubmitting,
      })}
    </form>
  )
}

export default NameStep
