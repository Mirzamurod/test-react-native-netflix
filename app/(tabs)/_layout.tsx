import { Tabs } from 'expo-router'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Browse',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign size={24} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='movies'
        options={{
          title: 'Movies',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name='video-library' color={color} />,
        }}
      />
      <Tabs.Screen
        name='tv'
        options={{
          title: 'TV',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo size={24} name='tv' color={color} />,
        }}
      />
      <Tabs.Screen
        name='my-list'
        options={{
          title: 'My List',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo size={24} name='list' color={color} />,
        }}
      />
    </Tabs>
  )
}
