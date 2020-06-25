import { BaseRaw } from '~/models/raw'

export namespace Quote {
  export const type = 'com.hutattedonmyarm.quote' as const

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

export interface Quote extends BaseRaw {
  type: typeof Quote.type
  value: Quote.Value
}
