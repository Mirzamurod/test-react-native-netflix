import { useEffect, useState } from 'react'
import { Redirect, usePathname, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from '@/components'
import { IAccount } from '@/types'
import { deleteAccount, getAccounts } from '@/lib/firebase'
import { useGlobalContext } from '@/context'

const Account = () => {
  const router = useRouter()
  const { user, account } = useGlobalContext()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<IAccount[]>([])

  useEffect(() => {
    getAllAccounts()
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

  const onDelete = async (id: string) => {
    try {
      const isConfirm = await new Promise((resolve, reject) => {
        Alert.alert('Delete account', 'Are you sure you want to delete this account', [
          { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
          { text: 'OK', onPress: () => resolve(true) },
        ])
      })

      if (isConfirm) {
        setIsLoading(true)
        const res = await deleteAccount(id)
        if (res.status) {
          const newAccounts = accounts.filter(account => account._id !== id)
          setAccounts(newAccounts)
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  if (account !== null) return <Redirect href='/' />

  return (
    <View className='flex-1'>
      <SafeAreaView>
        <Image
          source={require('@/assets/images/netflix.png')}
          resizeMode='contain'
          style={{ width: 150, height: 40 }}
        />
      </SafeAreaView>
      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={<RefreshControl onRefresh={getAllAccounts} refreshing={isLoading} />}
        >
          <View className='wrapper flex-1 justify-center items-center bg-transparent py-5'>
            {accounts.map(account => (
              <View
                key={account._id}
                className='account w-full h-24 bg-neutral-800 rounded flex-row items-center mt-5'
              >
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png',
                  }}
                  resizeMode='contain'
                  className='profile w-24 h-24 rounded mt-2'
                />
                <View className='profileInfo ml-3 bg-transparent'>
                  <Text className='text-xl font-bold'>{account.name}</Text>
                  <TouchableOpacity
                    className='editBtn w-24 h-8 bg-[#e7442e] justify-center items-center mt-3 rounded'
                    onPress={() => onDelete(account._id)}
                  >
                    <Text className='text-base'>Delete</Text>
                  </TouchableOpacity>
                </View>
                <LinearGradient colors={['#3c3cb5', '#00d4ff']} style={styles.go}>
                  <TouchableOpacity
                    onPress={() => router.push(`/login-account?accountId=${account._id}`)}
                  >
                    <Entypo name='chevron-thin-right' size={36} color='white' />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
            {accounts.length < 4 ? (
              <TouchableOpacity
                className='add mt-5 h-12 bg-transparent justify-center items-center px-5 border border-white rounded-lg'
                onPress={() => router.push('/create-account')}
              >
                <Text className='addText text-lg font-medium'>Add account</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  go: {
    position: 'absolute',
    height: '100%',
    width: 100,
    right: 0,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
