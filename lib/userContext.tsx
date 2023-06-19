import { User as FirebaseUser } from 'firebase/auth'
import { createContext, useContext, useEffect } from 'react'
import { AdminUser, User } from 'domain/user'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase'
import { UserRepository } from './repositories/user-repository'
import { ComponentWithChildren } from 'types'
import { doc, onSnapshot } from 'firebase/firestore'

type IUserContext = {
  firebaseUser: FirebaseUser | null
  user: User | null
  isLoadingUser: boolean
  adminUser: AdminUser | null
  isLoadingAdminUser: boolean
  isLoadingCredentials: boolean
}

export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  user: null,
  adminUser: null,
  isLoadingUser: false,
  isLoadingAdminUser: false,
  isLoadingCredentials: false,
})

export const UserContextProvider = ({ children }: ComponentWithChildren) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoadingAdminUser, setIsLoadingAdminUser] = useState(false)

  const onUserChanged = async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      user && setUser(null)
      adminUser && setAdminUser(null)
      return
    }

    setIsLoadingUser(true)
    setIsLoadingAdminUser(true)
    await Promise.all([
      UserRepository.getUser(firebaseUser.uid)
        .then(setUser)
        .finally(() => setIsLoadingUser(false)),
      UserRepository.getAdminUser(firebaseUser.uid)
        .then(setAdminUser)
        .finally(() => setIsLoadingAdminUser(false)),
    ])
  }

  const [firebaseUser = null, isLoadingFirebaseUser] = useAuthState(auth, { onUserChanged })
  console.log('firebaseUser', firebaseUser)

  useEffect(() => {
    let unsubscribe: any
    if (isLoadingUser) return
    if (firebaseUser) {
      unsubscribe = onSnapshot(doc(db, 'users', firebaseUser.uid), (userDocument) => {
        if (userDocument.exists()) {
          const userData = userDocument.data() as User
          setUser(userData)
        }
      })
    }
    if (!firebaseUser) {
      setUser(null)
    }

    return unsubscribe
  }, [firebaseUser])

  useEffect(() => {
    let unsubscribe: any
    if (isLoadingAdminUser) return
    if (firebaseUser) {
      unsubscribe = onSnapshot(doc(db, 'admins', firebaseUser.uid), (adminUserDocument) => {
        if (adminUserDocument.exists()) {
          const adminData = adminUserDocument.data() as AdminUser
          setAdminUser(adminData)
        }
      })
    }

    if (!firebaseUser) {
      setAdminUser(null)
    }

    return unsubscribe
  }, [firebaseUser])

  const isLoadingCredentials = isLoadingFirebaseUser || isLoadingUser || isLoadingAdminUser

  return (
    <UserContext.Provider
      value={{ firebaseUser, user, adminUser, isLoadingUser, isLoadingAdminUser, isLoadingCredentials }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) throw new Error('useUserContext should be used within a UserContext.Provider ')

  return context
}
