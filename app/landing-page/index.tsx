import TopNavBar from './top-nav-bar'
import SubTitle from 'shared/text/subtitle'
import Title from 'shared/text/title'
import WaveIcon from './wave'
import SignInSignUpForm from './sign-in-sign-up-form'

export default function LandingPage() {
  return (
    <>
      <TopNavBar addGoToApp />
      <main>
        <section className="grid grid-cols-1 gap-2 px-4 sm:px-16 lg:px-44 lg:py-20 md:grid-cols-2">
          <div className="mb-10">
            <Title>
              Preparati in modo efficiente per il concorso
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-blue-700 to-blue-400"> SSM</span>
            </Title>
            <SubTitle className="py-4">Prova gratis</SubTitle>
            <SignInSignUpForm />
          </div>
          <div
            className="w-full bg-center bg-no-repeat bg-contain h-60 sm:h-80 sm:bg-top-center"
            style={{ backgroundImage: 'url(/home/doctor-icon.svg)' }}
          />
        </section>
        <WaveIcon />
      </main>
    </>
  )
}
