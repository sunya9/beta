import { Raw } from '~/models/raw'

export type Spoiler = Raw<Spoiler.Value>

export namespace Spoiler {
  export const type = 'shawn.spoiler'
  interface Value {
    topic: string;
    expired_at?: string;
  }
}
