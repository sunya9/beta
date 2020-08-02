import { BaseRaw } from '~/entity/raw'

export namespace Crosspost {
  export const type = 'io.pnut.core.crosspost' as const
  export interface Value {
    canonical_url: string
  }
}

export interface Crosspost extends BaseRaw {
  type: typeof Crosspost.type
  value: Crosspost.Value
}
