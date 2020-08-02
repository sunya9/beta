import { BaseRaw } from '~/entity/raw'

export namespace ChannelInvite {
  export const type = 'io.pnut.core.channel.invite' as const
  export interface Value {
    channel_id: string
    name?: string
  }
}

export interface ChannelInvite extends BaseRaw {
  type: typeof ChannelInvite.type
  value: ChannelInvite.Value
}
