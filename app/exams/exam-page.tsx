import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Routes } from 'lib/utils/routes'
import LoadingSpinner from 'shared/icon/loading-spinner'

const ExamHomePage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace({ pathname: Routes.appExamDetails, query: { ...router.query } })
  }, [])
  return <LoadingSpinner />
}

export default ExamHomePage
