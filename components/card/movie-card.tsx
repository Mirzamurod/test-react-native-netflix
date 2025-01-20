import { FC } from 'react'
import { usePathname, useRouter } from 'expo-router'
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { IMovie } from '@/types'
import { image185 } from '@/lib/api'

interface IProps {
  item: IMovie
}

const { width, height } = Dimensions.get('window')

const MovieCard: FC<IProps> = props => {
  const { item } = props
  const router = useRouter()
  const pathname = usePathname()

  return (
    <TouchableWithoutFeedback onPress={() => router.push(`/movie/${item.id}?type=${pathname}`)}>
      <Image source={{ uri: image185(item.poster_path) }} style={styles.image} />
    </TouchableWithoutFeedback>
  )
}

export default MovieCard

const styles = StyleSheet.create({
  image: {
    width: width * 0.3,
    height: height * 0.2,
  },
})
