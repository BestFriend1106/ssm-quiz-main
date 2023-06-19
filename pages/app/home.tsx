import HomePage from 'app/home-page'
import { NextPageWithAuth } from 'types'
import AppLayout from 'shared/layout/app-layout'

const Home: NextPageWithAuth = () => {
  return (
    <AppLayout title="Homepage">
      <HomePage />
    </AppLayout>
  )
}

Home.requireUserAuth = true
export default Home
