import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Banner, Loader, MovieCard, Text } from '@/components'
import { IMovie } from '@/types'
import { genreMovies } from '@/lib/api'

export default function Tv() {
  const [comedy, setComedy] = useState<IMovie[]>([])
  const [documentary, setDocumentary] = useState<IMovie[]>([])
  const [family, setFamily] = useState<IMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getTrendingMovies = async () => {
    setIsLoading(true)
    const comedy = await genreMovies('tv', 35)
    setComedy(comedy)
    setIsLoading(false)
  }

  const getTopRatedMovies = async () => {
    const documentary = await genreMovies('tv', 99)
    setDocumentary(documentary)
  }

  const getPopularMovies = async () => {
    const family = await genreMovies('tv', 10751)
    setFamily(family)
  }

  useEffect(() => {
    getTrendingMovies()
    getTopRatedMovies()
    getPopularMovies()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <ScrollView>
      <View className='flex-1'>
        <Banner movies={family} />
        <View className='flex-col gap-y-12 mt-12'>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Comedy Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {comedy.map(item => (
                <MovieCard item={item} key={item.id} />
              ))}
            </ScrollView>
          </View>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Documentary Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {documentary.map(item => (
                <MovieCard item={item} key={item.id} />
              ))}
            </ScrollView>
          </View>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Family Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {family.map(item => (
                <MovieCard item={item} key={item.id} />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})
