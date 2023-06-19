import { twMerge } from 'tailwind-merge'

type UserAvatarProps = {
  photoUrl?: string | null
  displayName?: string | null
  className?: string
}

const UserAvatar = ({ className, photoUrl, displayName }: UserAvatarProps) => {
  const baseAvatarStyle = 'w-10 h-10 overflow-hidden rounded-full ring-2 ring-blue-400 ring-opacity-60 ring-offset-2'
  const nameInitials =
    displayName
      ?.split(' ')
      .map((word) => word[0])
      .filter((_, index, initials) => [0, initials.length - 1].includes(index))
      .join('')
      .toUpperCase() ?? '?'

  return photoUrl ? (
    <div className={twMerge(baseAvatarStyle, className)}>
      <img className="" src={photoUrl} alt="user avatar" referrerPolicy="no-referrer" />
    </div>
  ) : (
    <div className={twMerge(baseAvatarStyle, 'grid font-bold text-white  bg-slate-700 place-items-center', className)}>
      {nameInitials}
    </div>
  )
}

export default UserAvatar
