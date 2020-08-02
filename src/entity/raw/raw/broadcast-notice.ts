import { BaseRaw } from '~/entity/raw'

export namespace BroadcastNotice {
  export const type = 'net.patter-app.broadcast' as const
  export interface Value {
    id: string
    url?: string
  }
}

export interface BroadcastNotice extends BaseRaw {
  type: typeof BroadcastNotice.type
  value: BroadcastNotice.Value
}
