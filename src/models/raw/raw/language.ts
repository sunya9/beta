import { BaseRaw } from '~/models/raw'

export namespace Language {
  export const type = 'io.pnut.core.oembed' as const
  export interface Value {
    language: string
  }
}

export interface Language extends BaseRaw {
  type: typeof Language.type
  value: Language.Value
}
