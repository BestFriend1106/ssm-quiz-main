import classNames from 'classnames'
import { IconComponent } from 'types'
import {
  ClipboardDocumentListIcon as ExamsIcon,
  ArrowLeftOnRectangleIcon as SignoutIcon,
  QuestionMarkCircleIcon as QuestionsIcon,
} from '@heroicons/react/24/outline'
import { AuthService } from 'lib/services/auth-service'
import { useRouter } from 'next/router'
import UserAvatar from 'shared/card/user-avatar'
import { useUserContext } from 'lib/userContext'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import { Routes } from 'lib/utils/routes'
import { twMerge } from 'tailwind-merge'
type AdminSideBarProps = {
  isCollapsed?: boolean
}

const AdminSidebarItem = ({
  label,
  icon: Icon,
  isCollapsed = false,
  selected = false,
  disabled = false,
  onClick,
}: {
  label: string
  icon?: IconComponent
  isCollapsed?: boolean
  selected?: boolean
  disabled?: boolean
  onClick?(): void
}) => {
  return (
    <li onClick={onClick} className={classNames('flex items-center justify-center group')}>
      <button
        title={label}
        className={twMerge(
          'relative flex items-center',
          'w-full h-11 rounded-lg',
          'border-l-4 border-r-4 border-transparent group-focus:outline-none',
          'group-hover:bg-blue-500',
          'group-hover:text-white',
          selected &&
            'bg-blue-200 border-l-yellow-300 border-r-transparent group-hover:bg-blue-200 group-hover:border-l-yellow-300 group-hover:text-[inherit]',
          disabled && 'bg-white text-slate-400 group-hover:bg-white border-transparent group-hover:text-slate-400'
        )}
        disabled={disabled || selected}
      >
        {Icon && (
          <span className={classNames('inline-flex items-center justify-center', isCollapsed ? 'mx-auto' : 'ml-4')}>
            <Icon
              className={classNames(
                'w-5 h-5 shadow-xl text-slate-500 group-hover:text-white',
                selected && 'group-hover:text-slate-500',
                disabled && 'text-slate-400 group-hover:text-slate-400'
              )}
            />
          </span>
        )}
        <span className={classNames('ml-2 text-sm tracking-wide truncate', isCollapsed ? 'hidden' : 'block')}>
          {label}
        </span>
      </button>
    </li>
  )
}

const AdminSidebar = ({ isCollapsed = false }: AdminSideBarProps) => {
  const router = useRouter()
  const { firebaseUser } = useUserContext()

  const hideOnCollapseStyle = isCollapsed ? 'hidden' : 'block'
  return (
    <div
      className={classNames(
        'relative flex flex-col items-center',
        'h-full shadow-md ',
        isCollapsed ? 'w-14' : 'w-48',
        'text-slate-600 font-semibold',
        'border-none z-10',
        'transition-all duration-300',
        'overflow-x-hidden overflow-y-auto'
      )}
    >
      <ul className={classNames('relative flex flex-col w-[inherit] py-4 space-y-1', isCollapsed ? 'px-1' : 'px-2')}>
        <li className={'truncate'}>
          <p className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-t from-blue-700 to-blue-200">
            {isCollapsed ? 'SQ' : 'SSM Quiz'}
          </p>
        </li>
        <li className="flex flex-col items-center justify-center py-10">
          <UserAvatar
            photoUrl={firebaseUser?.photoURL}
            displayName={firebaseUser?.displayName}
            className={classNames(
              isCollapsed ? 'w-4 h-4 rounded-sm' : 'w-16 h-16 rounded-lg',
              'shadow-[0_1px_50px_1px_theme(colors.zinc.400)bb]'
            )}
          />
          <Body1 className={classNames('mt-2', hideOnCollapseStyle)}>{firebaseUser?.displayName}</Body1>
          <Body2 className={classNames('font-semibold', hideOnCollapseStyle)}>Admin</Body2>
        </li>

        <AdminSidebarItem
          label="Esami"
          isCollapsed={isCollapsed}
          icon={ExamsIcon}
          onClick={() => router.push(Routes.adminExams)}
          selected={router.pathname == Routes.adminExams}
        />
        <AdminSidebarItem
          label="Domande"
          isCollapsed={isCollapsed}
          icon={QuestionsIcon}
          onClick={() => router.push(Routes.adminQuestions)}
          selected={router.pathname == Routes.adminQuestions}
        />
        <AdminSidebarItem
          label="Esci"
          isCollapsed={isCollapsed}
          icon={SignoutIcon}
          onClick={() => {
            AuthService.signOutAdminUser(router)
            router.push(Routes.adminLoginPage)
          }}
        />
      </ul>
    </div>
  )
}

export default AdminSidebar
