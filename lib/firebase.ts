// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth, initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore'
import { IAccount, IList, IMovie } from '@/types'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAtgDVSd4VcjFTaSJL2aJxl2MTvmYVV3kc',
  authDomain: 'netflix-d9b1b.firebaseapp.com',
  projectId: 'netflix-d9b1b',
  storageBucket: 'netflix-d9b1b.firebasestorage.app',
  messagingSenderId: '725045056330',
  appId: '1:725045056330:web:cc473ed6207345debf27b3',
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig)
let app: FirebaseApp
let auth: Auth
let db: Firestore

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
    db = getFirestore(app)
  } catch (error) {
    console.log('Firebase initialization error')
  }
} else {
  app = getApp()
  auth = getAuth()
  db = getFirestore()
}

export { auth, db }

export const getAccounts = async (uid: string) => {
  const accountsRef = collection(db, 'accounts')

  const querySnapshot = await getDocs(accountsRef)
  const accounts: IAccount[] = []
  querySnapshot.forEach(doc => {
    accounts.push(doc.data() as IAccount)
  })

  return accounts.filter(account => account.uid === uid)
}

export const createAccount = async (data: IAccount) => {
  const { _id, name, pin, uid } = data

  const allAccounts = await getAccounts(uid)

  if (allAccounts.length === 4) {
    return {
      status: false,
      message: "You can't have more than 4 accounts per user",
    }
  }

  for (const account of allAccounts) {
    if (account.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
      return {
        status: false,
        message: 'You already have an account with this name',
      }
    }
  }

  await addDoc(collection(db, 'accounts'), data)

  return {
    status: true,
    message: 'Account created successfully',
  }
}

export const deleteAccount = async (id: string) => {
  const accountsRef = collection(db, 'accounts')
  const querySnapshot = await getDocs(accountsRef)
  const accounts: { _id: string; id: string }[] = []
  querySnapshot.forEach(doc => accounts.push({ _id: doc.data()._id, id: doc.id }))

  const account = accounts.find(account => account._id === id)

  await deleteDoc(doc(db, 'accounts', account?.id!))

  return { status: true, message: 'Account deleted successfully' }
}

export const getAccount = async (pin: string, accountId: string) => {
  const accountsRef = collection(db, 'accounts')
  const querySnapshot = await getDocs(accountsRef)
  const accounts: IAccount[] = []
  querySnapshot.forEach(doc => accounts.push(doc.data() as IAccount))

  const account = accounts.find(account => account.pin === pin && account._id === accountId)

  if (!account) {
    return { status: false, message: 'Account not found' }
  }

  return { status: true, message: 'Account found', data: account }
}

export const createList = async (
  accountId: string,
  data: { poster_path: string; id: number; title: string },
  type: string
) => {
  // Get all lists
  const listsRef = collection(db, 'lists')
  const querySnapshot = await getDocs(listsRef)
  const lists: { id: number; accountId: string }[] = []
  querySnapshot.forEach(doc => lists.push(doc.data() as { id: number; accountId: string }))

  // Check if list already exists
  const list = lists.find(list => list.id === data.id && list.accountId === accountId)

  if (list) {
    return { status: false, message: 'List already exists' }
  }

  const { poster_path, id, title } = data
  await addDoc(collection(db, 'lists'), { accountId, poster_path, id, type, title })

  return { status: true, message: 'List created successfully' }
}

export const getAllLists = async (accountId: string) => {
  const listsRef = collection(db, 'lists')
  const querySnapshot = await getDocs(listsRef)
  const lists: IList[] = []
  querySnapshot.forEach(doc => lists.push(doc.data() as IList))

  return lists.filter(list => list.accountId === accountId)
}
