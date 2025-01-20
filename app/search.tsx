import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { debounce } from 'lodash'
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Entypo, FontAwesome } from '@expo/vector-icons'
import { IMovie } from '@/types'
import { imageOriginal, searchMovies } from '@/lib/api'
import { Loader, Text } from '@/components'

const { width, height } = Dimensions.get('window')

const Search = () => {
  const router = useRouter()
  const [results, setResults] = useState<IMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (text: string) => {
    if (text && text.length) {
      setIsLoading(true)

      const res = await searchMovies({ query: text })
      setResults(res)
      setIsLoading(false)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='container my-3 mb-3 flex-row justify-between items-center border border-stone-300 rounded-[20px]'>
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder='Search for a movie'
          placeholderTextColor='lightgray'
          className='input p-3 text-lg flex-1 text-white font-medium'
        />
        <TouchableOpacity className='XIcon p-3' onPress={() => router.replace('/')}>
          <FontAwesome name='times-circle' size={24} color='white' />
        </TouchableOpacity>
      </View>
      {results.length ? (
        <Text className='resultsText font-medium text-lg ml-4 pt-2'>Results: {results.length}</Text>
      ) : null}
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {results.length ? (
            <View className='wrapper gap-3 flex-row flex-wrap mt-5'>
              {results.map(movie => (
                <TouchableOpacity key={movie.id} onPress={() => router.push(`/movie/${movie.id}`)}>
                  <Image source={{ uri: imageOriginal(movie.poster_path) }} style={styles.image} />
                  <Text className='text text-base my-1'>
                    {movie.title.length > 18 ? movie.title.slice(0, 18) + '...' : movie.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className='flex-1 items-center justify-center mt-20'>
              <Entypo name='emoji-sad' size={56} color='white' />
              <Text className='text-xl font-bold mt-4'>Sorry, we couldn't find any results</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
  image: {
    width: width * 0.44,
    height: height * 0.3,
  },
})
