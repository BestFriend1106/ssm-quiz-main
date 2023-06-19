import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  auth,
  signInWithThirdPartyProvider,
  googleAuthProvider,
  facebookAuthProvider,
  emailAndPasswordSignInProvider,
} from 'lib/firebase'
import { useForm } from 'react-hook-form'
import SocialMediaButton from 'shared/button/social-media'
import TextInput from 'shared/input/text-input'
import SectionTitle from 'shared/text/section-title'
import { AuthenticationMethod } from 'domain/user'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthCredential,
  sendPasswordResetEmail,
} from 'firebase/auth'
import useModal from 'shared/overlay/use-modal'
import ActionModal from 'shared/overlay/action-modal'
import Separator from 'shared/text/separator'
import SubmitButton from 'shared/button/submit'
import { FirebaseError } from 'firebase/app'
import toast from 'react-hot-toast'
import { UserRepository } from 'lib/repositories/user-repository'
import CheckboxInput from 'shared/input/checkbox-input'
import { Routes } from 'lib/utils/routes'

type EmailLoginData = {
  email: string
  password: string
  rememberMe?: boolean
}

type ExistingAccountState = {
  authenticationMethods: AuthenticationMethod[]
  email: string
  pendingCredential?: OAuthCredential
}

function SignInSignUpForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EmailLoginData>({ defaultValues: { rememberMe: false } })

  const [existingAccountState, setExistingAccountState] = useState<ExistingAccountState | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    isOpen: isEmailConnectedModal,
    openModal: openEmailConnectedModal,
    closeModal: closeEmailConnectedModal,
  } = useModal()

  const validateUserCanLoginWithEmail = handleSubmit(async (data: EmailLoginData) => {
    const existingAuthenticationMethods = await verifyExistingAuthenticationMethodsForEmail(data.email)
    if (
      existingAuthenticationMethods.length > 0 &&
      !existingAuthenticationMethods.includes(AuthenticationMethod.EmailAndPassword)
    ) {
      openEmailConnectedModal()
    }
  })

  const verifyExistingAuthenticationMethodsForEmail = async (email: string): Promise<AuthenticationMethod[]> => {
    const authenticationMethodsForEmail = await fetchSignInMethodsForEmail(auth, email)
    const supportedAuthenticationMethods = authenticationMethodsForEmail.filter((method) =>
      Object.values(AuthenticationMethod).includes(method as AuthenticationMethod)
    ) as AuthenticationMethod[]

    setExistingAccountState({
      email,
      authenticationMethods: supportedAuthenticationMethods,
    })
    return supportedAuthenticationMethods
  }

  const onSubmit = handleSubmit(async (data: EmailLoginData) => {
    if (!isValid) return
    setAuthError(null)
    const persistence = data.rememberMe ? browserLocalPersistence : browserSessionPersistence
    await auth.setPersistence(persistence)
    if (existingAccountState?.authenticationMethods.includes(AuthenticationMethod.EmailAndPassword)) {
      const signedInUser = await signInWithEmailPassword(data.email, data.password)
      if (!signedInUser) return
      router.push(Routes.appHome)
      return
    }

    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async ({ user }) => {
        await UserRepository.getOrCreateUser(user.uid)

        router.push(Routes.appHome)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
      })
  })

  const signInWithEmailPassword = async (email: string, password: string) => {
    return await emailAndPasswordSignInProvider(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        return user
      })
      .catch(async (error) => {
        if (error.code == 'auth/wrong-password') {
          setError('password', { type: 'custom', message: 'Email e password non corrispondono. Per favore riprova' })
          return
        }
        const errorCode = error.code
        const errorMessage = error.message
        console.log('Error on email signin: ', errorCode, ' - ', errorMessage)
        console.log(error.customData)
        return
      })
  }

  // TODO refactoring third-party signin methods to use common error handling
  const signInWithGoogle = async () => {
    const rememberMeState = getValues('rememberMe')
    const persistence = rememberMeState ? browserLocalPersistence : browserSessionPersistence
    await auth.setPersistence(persistence)
    try {
      const { user } = await signInWithThirdPartyProvider(auth, googleAuthProvider)
      await UserRepository.getOrCreateUser(user.uid)
      router.push(Routes.appHome)
    } catch (error) {
      if (error instanceof FirebaseError) {
        const pendingCredential = GoogleAuthProvider.credentialFromError(error) ?? undefined
        const authEmail = (error.customData?.email as string | undefined) ?? null
        if (authEmail) {
          const authMethods = await verifyExistingAuthenticationMethodsForEmail(error.customData?.email as string)
          setExistingAccountState({
            email: authEmail,
            authenticationMethods: authMethods,
            pendingCredential: pendingCredential,
          })
          openEmailConnectedModal()
        }
      }
    }
  }

  const signInWithFacebook = async () => {
    const rememberMeState = getValues('rememberMe')
    const persistence = rememberMeState ? browserLocalPersistence : browserSessionPersistence
    await auth.setPersistence(persistence)
    try {
      const { user } = await signInWithThirdPartyProvider(auth, facebookAuthProvider)
      await UserRepository.getOrCreateUser(user.uid)
      router.push(Routes.appHome)
    } catch (error) {
      if (error instanceof FirebaseError) {
        const pendingCredential = FacebookAuthProvider.credentialFromError(error) ?? undefined
        const authEmail = (error.customData?.email as string | undefined) ?? null
        if (authEmail) {
          const authMethods = await verifyExistingAuthenticationMethodsForEmail(error.customData?.email as string)
          setExistingAccountState({
            email: authEmail,
            authenticationMethods: authMethods,
            pendingCredential: pendingCredential,
          })
          openEmailConnectedModal()
        }
      }
    }
  }

  const canAuthenticateWithEmail =
    existingAccountState?.authenticationMethods.length == 0 ||
    existingAccountState?.authenticationMethods?.includes(AuthenticationMethod.EmailAndPassword)

  // TODO refactor for custom component
  const getButtonForAuthenticationMethod = ({
    key,
    method,
    onClick,
    className = '',
  }: {
    method: AuthenticationMethod
    onClick?: () => void
    className?: string
    key?: string | number
  }) => {
    const authMethodActionMap: { [K in AuthenticationMethod]?: () => Promise<void> } = {
      [AuthenticationMethod.Google]: signInWithGoogle,
      [AuthenticationMethod.Facebook]: signInWithFacebook,
      [AuthenticationMethod.EmailAndPassword]: async () => {
        existingAccountState?.email && setValue('email', existingAccountState.email)
      },
    }

    const onClickButton = () => {
      authMethodActionMap[method]?.()
      onClick?.()
    }
    return <SocialMediaButton key={key ?? method} provider={method} onClick={onClickButton} className={className} />
  }
  return (
    <>
      <ActionModal
        header="E-mail già connessa"
        description={[
          'La tua email è associata a un account esistente.',
          'Accedi con uno dei seguenti metodi per connetterti con il tuo account esistente:',
        ]}
        isOpen={isEmailConnectedModal}
        onClose={closeEmailConnectedModal}
      >
        <div className="flex justify-center mt-3">
          {existingAccountState?.authenticationMethods?.map((method, index) =>
            getButtonForAuthenticationMethod({
              method,
              className: index > 0 ? 'ml-2' : '',
              onClick: closeEmailConnectedModal,
              key: index,
            })
          )}
        </div>
      </ActionModal>
      <SectionTitle className="mb-2">Entra con:</SectionTitle>
      {getButtonForAuthenticationMethod({ method: AuthenticationMethod.Google })}
      {getButtonForAuthenticationMethod({ method: AuthenticationMethod.Facebook, className: 'ml-2' })}
      <form className="max-w-md" onSubmit={canAuthenticateWithEmail ? onSubmit : validateUserCanLoginWithEmail}>
        <Separator text="O" className="my-4" />
        <TextInput
          type="text"
          className="mt-4"
          aria-label="La tua mail"
          placeholder="La tua mail"
          errorMessage={errors.email?.message}
          {...register('email', {
            required: "L'e-mail è richiesta",
            onChange: () => setExistingAccountState(null),
            pattern: { value: /^\S+@\S+$/i, message: "Per favore aggiungi un'e-mail valida" },
          })}
        />
        {canAuthenticateWithEmail && (
          <TextInput
            type="password"
            className="mt-4"
            aria-label="password"
            placeholder="La tua password"
            errorMessage={errors.password?.message}
            {...register('password', {
              required: "E 'richiesta la password",
              minLength: { value: 6, message: 'La password deve contenere almeno 6 caratteri' },
            })}
            autoFocus
          />
        )}
        <p className="text-red-400">{authError}</p>
        <CheckboxInput label="Ricordarsi di me" {...register('rememberMe')} className="mt-3" />
        <div className="flex items-center justify-between mt-4 mb-4">
          <SubmitButton isLoading={isSubmitting} className="px-10 py-3">
            {canAuthenticateWithEmail ? 'Entra' : 'Prossimo'}
          </SubmitButton>
          {canAuthenticateWithEmail && (
            <span
              className="ml-2 text-xs font-bold text-blue-500 cursor-pointer"
              onClick={async () => {
                const userEmail = getValues('email')
                toast.promise(sendPasswordResetEmail(auth, getValues('email'), { url: window.location.href }), {
                  loading: 'Invio di e-mail..',
                  success: (
                    <span>
                      È stata inviata un'e-mail di recupero per <b>{userEmail}</b>
                    </span>
                  ),
                  error: "Errore nel tentativo di inviare l'e-mail di recupero",
                })
              }}
            >
              PASSWORD DIMENTICATA?
            </span>
          )}
        </div>
      </form>
    </>
  )
}

export default SignInSignUpForm
