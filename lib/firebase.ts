// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
} from 'firebase/auth'
export { fetchSignInMethodsForEmail } from 'firebase/auth'
import * as firestoreModule from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBcCHtqcUnywWN4buLJLwzIwyiV0dynCs4',
  authDomain: 'ssm-quiz.firebaseapp.com',
  projectId: 'ssm-quiz',
  storageBucket: 'ssm-quiz.appspot.com',
  messagingSenderId: '534809277690',
  appId: '1:534809277690:web:dd5419d36bd544a8734543',
}

const firebaseApps = getApps()
let app = firebaseApps?.[0]

if (!app) {
  app = initializeApp(firebaseConfig)
  firestoreModule.initializeFirestore(app, { ignoreUndefinedProperties: true })
}

export const auth = getAuth(app)
auth.languageCode = 'it'

export const googleAuthProvider = new GoogleAuthProvider()
export const facebookAuthProvider = new FacebookAuthProvider()
export const signInWithThirdPartyProvider = signInWithPopup
export const emailAndPasswordSignInProvider = signInWithEmailAndPassword
export const signUpWithEmailAndPassword = createUserWithEmailAndPassword

export const db = firestoreModule.getFirestore(app)
export const storage = getStorage(app)

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  firestoreModule.connectFirestoreEmulator(db, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
}
