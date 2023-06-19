import { updateProfile, User as FirebaseUser } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { AdminUser, User } from 'domain/user'
import { db } from '../firebase'

export const USER_COLLECTION_NAME = 'users'
export const ADMIN_USER_COLLECTION_NAME = 'admins'

const getUser = async (userId: string): Promise<User | null> => {
  const userDocRef = doc(db, USER_COLLECTION_NAME, userId)
  const userDocument = await getDoc(userDocRef)

  if (!userDocument.exists()) return null

  return userDocument.data() as User
}

const getAdminUser = async (adminUserId: string): Promise<AdminUser | null> => {
  const adminUserDocRef = doc(db, ADMIN_USER_COLLECTION_NAME, adminUserId)
  const adminUserDocument = await getDoc(adminUserDocRef)

  if (!adminUserDocument.exists()) return null

  return adminUserDocument.data() as AdminUser
}

const getOrCreateUser = async (userId: string): Promise<User | null> => {
  const defaultUserInfo = {
    id: userId,
    isOnboarded: false,
  }
  const existingUser = await getUser(userId)
  if (existingUser) {
    console.warn('User already exist. Aborting creation')
    return existingUser
  }

  const newUserDocRef = doc(db, USER_COLLECTION_NAME, userId)
  return await setDoc(newUserDocRef, defaultUserInfo)
    .then(() => defaultUserInfo)
    .catch((error) => {
      console.error('Error creating user: ', error)
      return null
    })
}

const isNicknameAvailable = async ({ userId, nickname }: { userId: string; nickname: string }) => {
  const nicknameCleaned = nickname.trim().toLowerCase()
  const usersWithNicknameQuery = query(
    collection(db, USER_COLLECTION_NAME),
    where('nickname_lowercase', '==', nicknameCleaned),
    where('id', '!=', userId)
  )
  const usersWithNicknameSnapshot = await getDocs(usersWithNicknameQuery)

  return usersWithNicknameSnapshot.empty
}

const updateUserDisplayName = async ({ user, newName }: { user: FirebaseUser; newName: string }) => {
  if (!newName || !user) return
  await updateProfile(user, { displayName: newName })
}

const registerUserNickname = async ({ userId, nickname }: { userId: string; nickname: string }) => {
  const nicknameTrimmed = nickname.trim()
  const userDocRef = doc(db, USER_COLLECTION_NAME, userId)
  await setDoc(
    userDocRef,
    { nickname: nicknameTrimmed, nickname_lowercase: nicknameTrimmed.toLowerCase() },
    { merge: true }
  )
}

const updateUser = async ({
  userId,
  dataToUpdate,
}: {
  userId: string
  dataToUpdate: Partial<Omit<User, 'nickname'>>
}) => {
  if (!userId || !dataToUpdate) return
  const userDocRef = doc(db, USER_COLLECTION_NAME, userId)
  await setDoc(userDocRef, dataToUpdate, { merge: true })
}

export const UserRepository = {
  getUser,
  getOrCreateUser,
  getAdminUser,
  updateUser,
  updateUserDisplayName,
  isNicknameAvailable,
  registerUserNickname,
}
