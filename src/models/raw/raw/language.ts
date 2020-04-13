import { Raw } from '~/models/raw'

export type Language = Raw<Language.Value>

export namespace Language {
  export const type = 'io.pnut.core.oembed'
  export interface Value {
    language: string
  }
}
