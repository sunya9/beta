import { BaseRaw } from '~/entity/raw'

export namespace Language {
  export const type = 'io.pnut.core.language' as const
  export interface Value {
    language: string
  }
}

export interface Language extends BaseRaw {
  type: typeof Language.type
  value: Language.Value
}
