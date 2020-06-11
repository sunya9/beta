// TODO: Fix dirty code
const isBrowser = process.browser || process.env.NODE_ENV === 'test'
export const Picker = isBrowser ? require('emoji-mart-vue').Picker : null

export interface Emoji {
  id: string
  name: string
  colons: string
  text: string
  emoticons: string[]
  skin: number | null
  custom?: boolean
  native: string
  imageUrl?: string
}
