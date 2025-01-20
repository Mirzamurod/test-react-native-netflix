import {} from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Loader = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size='large' color='#e7442e' />
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})
