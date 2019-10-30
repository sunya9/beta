import { Raw } from '~/models/raw'

export type ChannelInvite = Raw<ChannelInvite.Value>

export namespace ChannelInvite {
  export const type = 'io.pnut.core.channel.invite'
  interface Value {
    channel_id: string;
    name?: string;
  }
}
