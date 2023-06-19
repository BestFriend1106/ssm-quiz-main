import { ComponentWithChildren, PageAuth } from 'types'
import { useUserContext } from '../userContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OnboardingPage from 'app/onboarding-page'
import BaseModal from 'shared/overlay/base-modal'
import LoadingSpinner from 'shared/icon/loading-spinner'
import { Routes } from './routes'

type RouteRedirectProps = ComponentWithChildren & PageAuth

function RoutesRedirect({ children, requireUserAuth, requireAdminAuth }: RouteRedirectProps) {
  const router = useRouter()
  const { firebaseUser, user, adminUser, isLoadingCredentials } = useUserContext()

  const isUserNotAllowedInRoute = requireUserAuth && !user
  const isAdminUserNotAllowedInRoute = requireAdminAuth && !adminUser

  useEffect(() => {
    if (isLoadingCredentials) return
    if (isUserNotAllowedInRoute) {
      router.push(Routes.landingPage)
      return
    }
  }, [isLoadingCredentials])

  useEffect(() => {
    if (isLoadingCredentials) return

    if (isAdminUserNotAllowedInRoute) {
      const queryParams = firebaseUser ? { unauthorized: true } : {}
      router.push({ pathname: Routes.adminLoginPage, query: queryParams })
      return
    }
  }, [isLoadingCredentials])

  const requireAuth = requireUserAuth || requireAdminAuth
  const shouldWaitLoading = requireAuth && isLoadingCredentials

  if (shouldWaitLoading)
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={12} />
      </div>
    )

  if (isUserNotAllowedInRoute || isAdminUserNotAllowedInRoute) return null

  const shouldHaveOnboarding = requireUserAuth !== undefined && user !== null && !user.isOnboarded

  return (
    <>
      <BaseModal isOpen={shouldHaveOnboarding}>
        <OnboardingPage />
      </BaseModal>
      {children}
    </>
  )
}

export default RoutesRedirect
