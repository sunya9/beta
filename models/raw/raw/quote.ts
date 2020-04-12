import { Raw } from '~/models/raw'

export type Quote = Raw<Quote.Value>

export namespace Quote {
  export const type = 'com.hutattedonmyarm.quote'

  export interface Value {
    pos?: number[]
    len: number[]
    source_text: string

    source_pos?: number
    source_len?: number
    source_url?: string
    source_created_at: Date
  }
}
