import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { MovieCard, Text, ActorCard, Loader } from '@/components'
import { image500, movieCredits, movieDetails, similarMovies } from '@/lib/api'
import { IActor, IMovie } from '@/types'
import { createList } from '@/lib/firebase'
import { useGlobalContext } from '@/context'
import Toast from 'react-native-toast-message'

const { width, height } = Dimensions.get('window')

const MovieDetail = () => {
  const { id } = useGlobalSearchParams()
  const local = useLocalSearchParams()
  const router = useRouter()
  const { account } = useGlobalContext()
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [actors, setActors] = useState<IActor[]>([])
  const [movies, setMovies] = useState<IMovie[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const type = local.type === '/tv' ? 'tv' : 'movie'

  const getMovieDetail = async () => {
    setIsLoading(true)
    const data = await movieDetails(id as string, type)
    setMovie(data)
    setIsLoading(false)
  }

  useEffect(() => {
    getMovieDetail()
    getMovieActor()
    getSimilarMovies()
  }, [id])

  const getMovieActor = async () => {
    const data = await movieCredits(id as string, type)
    setActors(data)
  }

  const getSimilarMovies = async () => {
    const data = await similarMovies(id as string, type)
    setMovies(data)
  }

  const addList = async () => {
    setIsAdding(true)
    try {
      const res = await createList(
        account?._id!,
        { poster_path: movie?.poster_path!, id: movie?.id!, title: movie?.title! },
        type
      )

      if (!res.status) Toast.show({ type: 'error', text1: 'Error', text2: res.message })
      setIsAdding(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='container w-full'>
        {isAdding ? (
          <View
            className='absolute z-20 w-full h-full justify-center items-center'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <ActivityIndicator />
          </View>
        ) : null}
        <SafeAreaView className='header absolute z-20 flex-row justify-between items-center w-full px-5'>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='arrow-back-circle' size={40} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={addList}>
            <AntDesign name='heart' size={30} color='white' />
          </TouchableOpacity>
        </SafeAreaView>
        {isLoading ? (
          <View style={{ height }}>
            <Loader />
          </View>
        ) : (
          <View>
            <Image
              source={{ uri: image500(movie?.poster_path!) }}
              style={{ width, height: height * 0.7 }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)']}
              style={{ width, height: height * 0.4, position: 'absolute', bottom: 0 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>
      <View className='infoWrapper flex-col gap-y-4'>
        <Text className='title text-center text-3xl font-bold'>{movie?.title}</Text>
        <Text className='status text-center text-xl text-gray-500'>
          {movie?.status} • {movie?.release_date?.split('-')[0]} • {movie?.runtime} min
        </Text>
        <View className='genres flex-row gap-[10] justify-center'>
          {movie?.genres?.map((genre, index) => (
            <Text key={genre.id} className='genreText text-gray-300'>
              {genre.name} {index + 1 !== movie.genres.length ? ' •' : null}
            </Text>
          ))}
        </View>
        <Text className='overview ml-4'>{movie?.overview}</Text>
      </View>
      {actors?.length ? (
        <View className='actorWrapper mt-5 mb-3'>
          <Text className='actorTitle text-xl font-bold ml-3 mb-5'>Actors</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          >
            {actors?.map(actor => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </ScrollView>
        </View>
      ) : null}
      <View>
        <Text className='actorTitle text-xl font-bold ml-3 mb-5'>Similar Movies</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 15 }}
          showsHorizontalScrollIndicator={false}
        >
          {movies?.map(item => (
            <MovieCard item={item} key={item.id} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default MovieDetail

const styles = StyleSheet.create({})
