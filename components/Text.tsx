import { Text as RNText, TextProps } from 'react-native'

const Text = ({ className, ...props }: TextProps) => (
  <RNText className={`text-white ${className}`} {...props} />
)

export default Text
