import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { Routes } from 'lib/utils/routes'

const AdminHomePage = () => {
  const router = useRouter()
  useLayoutEffect(() => {
    router.replace(Routes.adminQuestions)
  }, [])
  return null
}

export default AdminHomePage
