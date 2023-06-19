import 'reflect-metadata'
import 'styles/globals.css'
import Head from 'next/head'

import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from 'lib/userContext'
import { NextComponentWithAuth } from 'types'
import RoutesRedirect from 'lib/utils/routes-redirect'
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'

type ExtendedAppProps<P = {}> = AppProps<P> & {
  Component: NextComponentWithAuth
}

function MyApp({ Component, pageProps: props }: ExtendedAppProps<{ dehydratedState: DehydratedState }>) {
  const { dehydratedState, ...pageProps } = props
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <Head>
          <title>SSM Quiz</title>
          <meta name="description" content="SSM Quiz simulations" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <UserContextProvider>
          <RoutesRedirect requireUserAuth={Component.requireUserAuth} requireAdminAuth={Component.requireAdminAuth}>
            <Component {...pageProps} />
          </RoutesRedirect>
          <Toaster />
        </UserContextProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
