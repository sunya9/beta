import { Raw } from '~/models/raw'

export type FallbackUrl = Raw<FallbackUrl.Value>

export namespace FallbackUrl {
  export const type = 'io.pnut.core.fallback_url'
  interface Value {
    url: string;
  }
}
