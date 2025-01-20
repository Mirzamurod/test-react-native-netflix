import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { ChildProps, IAccount, IContext, IUser } from '@/types'
import { auth } from '@/lib/firebase'
import { Loader } from '@/components'

const Context = createContext<IContext | null>(null)

export const Provider = ({ children }: ChildProps) => {
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [account, setAccount] = useState<IAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    onAuthStateChanged(auth, user => {
      if (user?.uid) {
        const data = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        }
        setUser(data as IUser)
        setIsLoading(false)
        router.replace('/')
      } else {
        setIsLoading(false)
        router.replace('/auth')
      }
    })
  }, [])

  if (isLoading) return <Loader />

  return (
    <Context.Provider value={{ user, setUser, account, setAccount }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    </Context.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(Context)
  if (!context) throw new Error('useGlobalContext must be used within a Provider')
  return context
}
