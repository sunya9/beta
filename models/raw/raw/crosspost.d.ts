import { Raw } from '~/models/raw'

export type Crosspost = Raw<Crosspost.Value>

export namespace Crosspost {
  export const type = 'io.pnut.core.crosspost'
  interface Value {
    canonical_url: string;
  }
}
