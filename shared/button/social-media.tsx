import classNames from 'classnames'
import { AuthenticationMethod } from 'domain/user'
import { EnvelopeIcon } from '@heroicons/react/20/solid'

type SocialMediaProviderInfo = {
  logo?: string
  icon?: React.ReactNode
  borderColor: string
}

type SocialMediaButtonProps = React.ComponentProps<'button'> & {
  provider: AuthenticationMethod
}

const providerInfoMap: Record<AuthenticationMethod, SocialMediaProviderInfo> = {
  [AuthenticationMethod.Google]: { logo: '/home/google-logo.svg', borderColor: 'border-red-500' },
  [AuthenticationMethod.Facebook]: { logo: '/home/facebook-logo.svg', borderColor: 'border-blue-400' },
  [AuthenticationMethod.EmailAndPassword]: {
    icon: <EnvelopeIcon className="text-slate-500 h-7" />,
    borderColor: 'border-gray-400',
  },
}

export default function SocialMediaButton({ provider, children, className, ...props }: SocialMediaButtonProps) {
  const providerInfo = providerInfoMap[provider]
  return (
    <button
      className={classNames(
        'w-20 p-2 box-content px-auto',
        'bg-white shadow-lg rounded-3xl',
        `border-2 ${providerInfo.borderColor} focus-visible:outline-none border-opacity-40`,
        className
      )}
      {...props}
    >
      <div className="flex justify-center">
        {children}
        {providerInfo.logo && <img src={providerInfo.logo} alt={`${provider} logo`} />}
        {providerInfo.icon}
      </div>
    </button>
  )
}
