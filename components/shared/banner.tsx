import { FC, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather, Ionicons } from '@expo/vector-icons'
import { IMovie } from '@/types'
import { imageOriginal } from '@/lib/api'
import Header from './header'
import Text from '../Text'
import { Headertabs } from '@/constants'

interface IProps {
  movies?: IMovie[]
}

const Banner: FC<IProps> = props => {
  const { movies } = props
  const router = useRouter()
  const [randomMovie, setRandomMovie] = useState<IMovie | null>(null)

  useEffect(() => {
    const movie = movies?.[Math.floor(Math.random() * movies?.length)]
    setRandomMovie(movie!)
  }, [movies?.length])

  return (
    <ImageBackground
      source={{ uri: imageOriginal(randomMovie?.poster_path!) }}
      style={styles.backgroundWrapper}
    >
      <Header />
      <LinearGradient
        colors={['black', 'transparent']}
        style={styles.infoWrapper}
        locations={[1, 0]}
      >
        <View className='pt-6 gap-5 w-full absolute bottom-0 bg-transparent'>
          <View className='flex-row justify-center items-center gap-4 bg-transparent'>
            {Headertabs.map(item => (
              <TouchableOpacity key={item.path} className='items-center'>
                <Text className='text-lg font-bold'>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className='text-3xl font-bold text-center'>
            {randomMovie?.title || randomMovie?.original_title}
          </Text>
          <View className='w-full mt-4 flex-row justify-center items-center gap-12'>
            <TouchableOpacity className='items-center'>
              <Ionicons name='add-outline' size={24} color='white' />
              <Text className='text-xs mt-1'>My List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/movie/${randomMovie?.id}`)}
              className='flex-row bg-white w-[142px] h-[32px] rounded-sm items-center justify-center'
            >
              <Ionicons name='play' size={26} />
              <Text className='text-base font-bold pl-1' style={{ color: '#000' }}>
                Play
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/movie/${randomMovie?.id}`)}>
              <Feather name='info' size={24} color='white' />
              <Text>Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default Banner

const styles = StyleSheet.create({
  backgroundWrapper: {
    width: '100%',
    height: (Dimensions.get('window').height * 81) / 100,
    position: 'relative',
    zIndex: -1,
  },
  infoWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height / 3,
  },
})
