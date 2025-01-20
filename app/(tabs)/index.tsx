import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { popularMovies, topRatedMovies, trendingMovies } from '@/lib/api'
import { IMovie } from '@/types'
import { Banner, Loader, MovieCard, Text } from '@/components'
import { useGlobalContext } from '@/context'
import { Redirect } from 'expo-router'

export default function Browse() {
  const { user, account } = useGlobalContext()
  const [trending, setTrending] = useState<IMovie[]>([])
  const [topRated, setTopRated] = useState<IMovie[]>([])
  const [popular, setPopular] = useState<IMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getTrendingMovies = async () => {
    setIsLoading(true)
    const trending = await trendingMovies()
    setTrending(trending)
    setIsLoading(false)
  }

  const getTopRatedMovies = async () => {
    const topRated = await topRatedMovies()
    setTopRated(topRated)
  }

  const getPopularMovies = async () => {
    const popular = await popularMovies()
    setPopular(popular)
  }

  useEffect(() => {
    getTrendingMovies()
    getTopRatedMovies()
    getPopularMovies()
  }, [])

  if (isLoading) return <Loader />
  if (user === null) return <Redirect href='/auth' />
  if (account === null) return <Redirect href='/account' />

  return (
    <ScrollView>
      <View className='flex-1'>
        <Banner movies={popular} />
        <View className='flex-col gap-y-12 mt-12'>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Trending Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {trending.map(item => (
                <MovieCard item={item} key={item.id} />
              ))}
            </ScrollView>
          </View>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Top Rated Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {topRated.map(item => (
                <MovieCard item={item} key={item.id} />
              ))}
            </ScrollView>
          </View>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>Popular Movies</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {popular.map(item => (
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
