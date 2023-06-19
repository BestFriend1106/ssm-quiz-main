import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useState } from 'react'

export const useRouterQueryParams = (onReady?: (queryParams?: ParsedUrlQuery) => void) => {
  const router = useRouter()
  const [queryParams, setQueryParams] = useState<ParsedUrlQuery>()

  useEffect(() => {
    if (!router?.isReady || queryParams) return
    setQueryParams(router.query)
  }, [router.isReady])

  useEffect(() => {
    if (!queryParams) return
    onReady?.(queryParams)
  }, [queryParams])

  return { queryParams }
}
