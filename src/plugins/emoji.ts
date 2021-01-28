// TODO: Fix dirty code
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
