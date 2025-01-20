import { FC } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '../Text'
import { IActor } from '@/types'
import { image185 } from '@/lib/api'

interface IProps {
  actor: IActor
}

const ActorCard: FC<IProps> = props => {
  const { actor } = props

  return (
    <TouchableOpacity style={{ marginRight: 4, alignItems: 'center', marginBottom: 12 }}>
      <View className='overflow-hidden items-center border border-gray-500 rounded-[50]'>
        <Image
          source={{ uri: image185(actor?.profile_path!) }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View>
      <Text className='text-base my-[10]'>
        {actor?.character?.length > 10 ? actor?.character?.slice(0, 10) + '...' : actor?.character}
      </Text>
      <Text className='text-sm' style={{ color: 'gray' }}>
        {actor?.original_name?.length > 10
          ? actor?.original_name?.slice(0, 10) + '...'
          : actor?.original_name}
      </Text>
    </TouchableOpacity>
  )
}

export default ActorCard

const styles = StyleSheet.create({})
