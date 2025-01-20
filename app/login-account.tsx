import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Formik } from 'formik'
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Text } from '@/components'
import { loginAccountSchema } from '@/lib/validation'
import { ErrorMsg } from './auth'
import { getAccount } from '@/lib/firebase'
import { useGlobalContext } from '@/context'
import { IAccount } from '@/types'

const { width, height } = Dimensions.get('window')

const LoginAccount = () => {
  const router = useRouter()
  const { accountId } = useLocalSearchParams()
  const { setAccount } = useGlobalContext()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async ({ pin }: { pin: string }) => {
    setIsLoading(true)
    try {
      const res = await getAccount(pin, accountId as string)

      if (res.status) {
        setError('')
        setAccount(res.data as IAccount)
        router.back()
      } else setError(res.message)

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className='flex-1 justify-center items-center'>
        <KeyboardAvoidingView
          style={{ height }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className='wrapper flex-1 justify-center items-center bg-transparent'>
            <View
              className='form rounded-xl p-5 justify-center bg-neutral-800'
              style={{ width: width / 1.2, minHeight: height / 3 }}
            >
              <Text className='title text-3xl font-bold text-white'>Login account</Text>

              <Formik
                onSubmit={onSubmit}
                initialValues={{ name: '', pin: '' }}
                validationSchema={loginAccountSchema}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                  <View className='flex-col'>
                    {error ? (
                      <View
                        className='alert p-3 rounded-xl mt-5'
                        style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}
                      >
                        <Text className='alertText font-bold'>{error}</Text>
                      </View>
                    ) : null}
                    <TextInput
                      onChangeText={handleChange('pin')}
                      onBlur={handleBlur('pin')}
                      value={values.pin}
                      placeholder='Enter your pin'
                      placeholderTextColor='gray'
                      className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
                      keyboardType='numeric'
                      maxLength={4}
                      secureTextEntry
                    />
                    <ErrorMsg>{errors.pin}</ErrorMsg>
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      className='formButton w-full h-12 bg-[#e7442e] mt-5 rounded-xl justify-center items-center border-0'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color='white' />
                      ) : (
                        <Text className='textButton text-base font-bold'>Create Account</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default LoginAccount

const styles = StyleSheet.create({})
