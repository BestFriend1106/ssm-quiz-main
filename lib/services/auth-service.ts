import { NextRouter } from 'next/router'
import { auth } from '../firebase'

const signOutUser = async (router?: NextRouter) => {
  await auth.signOut()
  router?.push('/')
}

const signOutAdminUser = async (router?: NextRouter) => {
  await auth.signOut()
  router?.push('/admin/login')
}

export const AuthService = {
  signOutUser,
  signOutAdminUser,
}
