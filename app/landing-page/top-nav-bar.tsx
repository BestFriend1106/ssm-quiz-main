import { useUserContext } from 'lib/userContext'

import ActionButton, { ActionButtonSecondary } from 'shared/button/action'
import { useRouter } from 'next/router'
import { AuthService } from 'lib/services/auth-service'
import { Routes } from 'lib/utils/routes'

export default function TopNavBar({ addGoToApp = false }: { addGoToApp?: boolean }) {
  const router = useRouter()
  const { firebaseUser } = useUserContext()

  const goToApp = () => {
    router.push(Routes.appHome)
  }

  return (
    <nav className="sticky top-0 flex justify-between px-4 py-2 bg-white md:px-8">
      <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-t from-blue-700 to-blue-400">
        SSM Quiz
      </p>
      <div className="flex">
        {firebaseUser && addGoToApp && (
          <ActionButtonSecondary className="mr-2" onClick={goToApp}>
            Apri l'app
          </ActionButtonSecondary>
        )}
        {firebaseUser && (
          <ActionButton className="px-4 py-2" onClick={() => AuthService.signOutUser(router)}>
            {firebaseUser ? 'Esci' : 'Connettersi'}
          </ActionButton>
        )}
      </div>
    </nav>
  )
}
