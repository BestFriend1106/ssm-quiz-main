export interface User {
  isOnboarded: boolean
  city?: string
  university?: string
  ssmSubject?: string
  nickname?: string
}

export interface AdminUser {
  isActive: boolean
}

export enum AuthenticationMethod {
  Google = 'google.com',
  EmailAndPassword = 'password',
  Facebook = 'facebook.com',
}
