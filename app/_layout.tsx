import { useEffect } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Provider } from '@/context'

import 'react-native-reanimated'
import '../style/global.css'

export const unstable_settings = { initialRouteName: '(tabs)' }

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='search' options={{ headerShown: false }} />
          <Stack.Screen name='auth' options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name='account' options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen
            name='create-account'
            options={{ presentation: 'modal', headerTitle: 'Create Account' }}
          />
          <Stack.Screen
            name='login-account'
            options={{ presentation: 'modal', headerTitle: 'Login Account' }}
          />
          {/* <Stack.Screen name='movie/:id' options={{ headerShown: false }} /> */}
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
        <Toast />
      </ThemeProvider>
    </Provider>
  )
}
