import { Raw } from '~/models/raw'

export type BroadcastNotice = Raw<BroadcastNotice.Value>

export namespace BroadcastNotice {
  export const type = 'net.patter-app.broadcast'
  interface Value {
    id: string;
    url?: string;
  }
}
