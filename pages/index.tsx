import type { NextPage } from 'next'
import Head from 'next/head'
import LandingPage from 'app/landing-page'

const Landing: NextPage = () => {
  return (
    <>
      <Head>
        <title>SSM Quiz</title>
        <meta name="description" content="SSM Quiz simulations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage />
    </>
  )
}

export default Landing
