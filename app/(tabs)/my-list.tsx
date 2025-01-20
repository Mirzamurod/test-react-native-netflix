import { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Loader, Text } from '@/components'
import { IList } from '@/types'
import { getAllLists } from '@/lib/firebase'
import { useGlobalContext } from '@/context'
import { imageOriginal } from '@/lib/api'

const { width, height } = Dimensions.get('window')

const MyList = () => {
  const router = useRouter()
  const { account } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(false)
  const [movies, setMovies] = useState<IList[]>([])

  useEffect(() => {
    getLists()
  }, [])

  const getLists = async () => {
    setIsLoading(true)
    try {
      const res = await getAllLists(account?._id!)
      setMovies(res as IList[])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />

  return movies.length === 0 ? (
    <View className='flex-1 items-center justify-center p-5'>
      <Text className='text-xl'>You don't have any list yet.</Text>
      <Link href='/' className='mt-4 py-4'>
        <Text className='text-sm text-[#e7442e]'>Browse page!</Text>
      </Link>
    </View>
  ) : (
    <ScrollView>
      <View className='flex-1'>
        <View className='flex-col gap-y-12 mt-12'>
          <View>
            <Text className='text-xl ml-1 mb-[10px]'>My List</Text>
            <View className='wrapper gap-3 flex-row flex-wrap mt-5'>
              {movies.map(item => (
                <TouchableOpacity key={item.id} onPress={() => router.push(`/movie/${item.id}`)}>
                  <Image source={{ uri: imageOriginal(item.poster_path) }} style={styles.image} />
                  <Text className='text text-base my-1'>
                    {item?.title!?.length > 18 ? item?.title?.slice(0, 18) + '...' : item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MyList

const styles = StyleSheet.create({
  image: {
    width: width * 0.44,
    height: height * 0.3,
  },
})
