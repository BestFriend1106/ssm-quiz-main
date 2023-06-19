import { useUserContext } from 'lib/userContext'

import { useRouter } from 'next/router'
import { Bars3Icon as HamburguerIcon, ArrowLeftOnRectangleIcon as SignoutIcon } from '@heroicons/react/20/solid'
import UserAvatar from 'shared/card/user-avatar'
import DropdownMenu, { DropdownMenuItemProps } from 'shared/overlay/dropdown-menu'
import { AuthService } from 'lib/services/auth-service'
import SectionTitle from 'shared/text/section-title'

type AdminNavBarProps = {
  title?: string
  toggleSidebarCollapse?(): void
}

const AdminNavBar = ({ title, toggleSidebarCollapse }: AdminNavBarProps) => {
  const router = useRouter()
  const { firebaseUser } = useUserContext()

  const dropdownItems: DropdownMenuItemProps[] = [
    { label: 'Esci', Icon: SignoutIcon, onClick: () => AuthService.signOutAdminUser(router) },
  ]

  return (
    <nav className="relative z-20 flex items-center justify-between px-4 py-2 shadow-md md:px-6">
      <div className="inline-flex items-center">
        <HamburguerIcon className="w-6 h-6 cursor-pointer" onClick={toggleSidebarCollapse} />
        <SectionTitle className="ml-4">{title}</SectionTitle>
      </div>
      <DropdownMenu items={dropdownItems}>
        <UserAvatar
          className="cursor-pointer"
          photoUrl={firebaseUser?.photoURL}
          displayName={firebaseUser?.displayName}
        />
      </DropdownMenu>
    </nav>
  )
}

export default AdminNavBar
