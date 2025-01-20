import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Text from '../Text'
import { useGlobalContext } from '@/context'
import { auth, getAccounts } from '@/lib/firebase'
import { IAccount } from '@/types'
import { signOut } from 'firebase/auth'

const Header = () => {
  const router = useRouter()
  const { user, account, setAccount, setUser } = useGlobalContext()
  const [isPopover, setIsPopover] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<IAccount[]>([])

  useEffect(() => {
    if (accounts.length === 0) getAllAccounts()
  }, [])

  const getAllAccounts = async () => {
    setIsLoading(true)
    try {
      const res = await getAccounts(user?.uid!)
      setAccounts(res)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      signOut(auth)
      setUser(null)
      setAccount(null)
      router.push('/auth')
      setIsPopover(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView>
      <View className='w-full flex-row justify-between items-center pt-3 pl-3 bg-transparent'>
        <Image
          source={require('@/assets/images/netflix.png')}
          resizeMode='contain'
          className='w-[150px] h-[40px]'
        />
        <View className='rightSide flex-row items-center gap-[10] bg-transparent relative'>
          <TouchableOpacity activeOpacity={0.5} onPress={() => router.replace('/search')}>
            <MaterialIcons name='search' size={30} color='red' />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsPopover(prev => !prev)}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
              }}
              resizeMode='contain'
              className='w-[30px] h-[30px] rounded-[20px]'
            />
          </TouchableOpacity>
          {isPopover ? (
            <View className='popoverWrapper absolute w-64 min-h-24 right-3 top-[110%] bg-neutral-800 rounded px-3 py-5'>
              {isLoading ? (
                <ActivityIndicator className='mt-4' />
              ) : (
                <>
                  {accounts.map(item => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => {
                        router.push('/account')
                        setAccount(null)
                      }}
                      className='account bg-transparent flex-row items-center gap-3 mb-3'
                    >
                      <Image
                        source={{
                          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
                        }}
                        resizeMode='contain'
                        className='w-[50px] h-[50px]'
                      />
                      <Text
                        className='text-xl font-bold'
                        style={{ color: item._id === account?._id ? '#e7442e' : 'white' }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    onPress={logout}
                    className='logoutBtn w-full justify-center items-center mt-3 rounded bg-red-500 h-12'
                  >
                    <Text className='logoutText font-bold text-base'>Logout</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({})
