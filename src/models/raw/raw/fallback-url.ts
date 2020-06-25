import { BaseRaw } from '~/models/raw'
export namespace FallbackUrl {
  export const type = 'io.pnut.core.fallback_url' as const
  export interface Value {
    url: string
  }
}

export interface FallbackUrl extends BaseRaw {
  type: typeof FallbackUrl.type
  value: FallbackUrl.Value
}
