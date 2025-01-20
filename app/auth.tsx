import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { Formik } from 'formik'
import { addDoc, collection } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from '@/components'
import { loginSchema, registerSchema } from '@/lib/validation'
import { auth, db } from '@/lib/firebase'
import { useGlobalContext } from '@/context'

interface IProps {
  setState: Dispatch<SetStateAction<'login' | 'register'>>
}

const { height } = Dimensions.get('window')

const Auth = () => {
  const [state, setState] = useState<'login' | 'register'>('login')

  const { user } = useGlobalContext()

  if (user !== null) return <Redirect href='/account' />

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://rb.gy/0oz37g' }}
        style={{ flex: 1, position: 'relative' }}
      >
        <View
          className='overlay absolute left-0 right-0 bottom-0 top-0 flex-1'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        />
        <SafeAreaView>
          <Image
            source={require('@/assets/images/netflix.png')}
            resizeMode='contain'
            className='w-[150px] h-10'
          />
        </SafeAreaView>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className='wrapper justify-center items-center bg-transparent flex-1' style={{}}>
            <View
              className='form w-11/12 bg-black rounded-xl p-5 justify-center'
              style={{ minHeight: height / 3 }}
            >
              {state === 'login' ? <Login setState={setState} /> : <Register setState={setState} />}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

export const ErrorMsg = ({ children }: { children?: ReactNode }) =>
  children ? (
    <Text className='mt-1 px-2' style={{ color: 'red' }}>
      {children}
    </Text>
  ) : null

function Login({ setState }: IProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      const res = await signInWithEmailAndPassword(auth, values.email, values.password)
      if (res.user.uid) {
        setIsLoading(false)
        setError('')
        router.push('/account')
      }
    } catch (error) {
      const result = error as Error
      console.log(result.message)
      setError(result.message)
      setIsLoading(false)
    }
  }

  return (
    <View>
      <Text className='title text-3xl font-bold text-white'>Sign In</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={onSubmit}
        validationSchema={loginSchema}
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
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='Enter your email'
              placeholderTextColor='gray'
              className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
            />
            <ErrorMsg>{errors.email}</ErrorMsg>
            <TextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
              placeholderTextColor='gray'
              className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
              secureTextEntry
            />
            <ErrorMsg>{errors.password}</ErrorMsg>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className='formButton w-full h-12 bg-[#e7442e] mt-5 rounded-xl justify-center items-center border-0'
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='textButton text-base font-bold'>Login</Text>
              )}
            </TouchableOpacity>
            <View className='bottomContent flex-row items-center mt-5 gap-3'>
              <Text>New to Netflix?</Text>
              <TouchableOpacity onPress={() => setState('register')}>
                <Text className='font-bold '>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

function Register({ setState }: IProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const onSubmit = async (values: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    try {
      setIsLoading(true)
      const res = await createUserWithEmailAndPassword(auth, values.email, values.password)
      updateProfile(res.user, { displayName: `${values.firstName} ${values.lastName}` })
      addDoc(collection(db, 'users'), { ...values, uid: res.user.uid, list: [] })
      if (res.user.uid) {
        setIsLoading(false)
        setError('')
        router.push('/account')
      }
    } catch (error) {
      const result = error as Error
      console.log(result.message)
      setError(result.message)
      setIsLoading(false)
    }
  }

  return (
    <View>
      <Text className='title text-3xl font-bold text-white'>Sign Up</Text>
      <Formik
        initialValues={{ email: '', password: '', firstName: '', lastName: '' }}
        onSubmit={onSubmit}
        validationSchema={registerSchema}
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
            <View className='flex-row gap-5'>
              <View className='flex-grow'>
                <TextInput
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                  placeholder='First Name'
                  placeholderTextColor='gray'
                  className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
                />
                <ErrorMsg>{errors.firstName}</ErrorMsg>
              </View>
              <View className='flex-grow'>
                <TextInput
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  placeholder='Last Name'
                  placeholderTextColor='gray'
                  className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
                />
                <ErrorMsg>{errors.lastName}</ErrorMsg>
              </View>
            </View>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='Enter your email'
              placeholderTextColor='gray'
              className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
            />
            <ErrorMsg>{errors.email}</ErrorMsg>
            <TextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
              placeholderTextColor='gray'
              className='input w-full h-12 border-0 p-3 rounded-xl bg-gray-800 text-white mt-5'
              secureTextEntry
            />
            <ErrorMsg>{errors.password}</ErrorMsg>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className='formButton w-full h-12 bg-[#e7442e] mt-5 rounded-xl justify-center items-center border-0'
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='textButton text-base font-bold'>Register</Text>
              )}
            </TouchableOpacity>
            <View className='bottomContent flex-row items-center mt-5 gap-3'>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => setState('login')}>
                <Text className='font-bold '>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

export default Auth

const styles = StyleSheet.create({})
