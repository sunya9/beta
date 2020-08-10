import { BaseRaw, Raw, HasRaw } from '~/entity/raw'
import { Entity } from '~/entity/entity'

export namespace ChannelInvite {
  export const type = 'io.pnut.core.channel.invite' as const
  export interface Value {
    channel_id: string
    name?: string
  }

  export function rawIsChannelInvite(raw: Raw): raw is ChannelInvite {
    return raw.type === ChannelInvite.type
  }

  export interface ChannelInviteForView extends ChannelInvite.Value {
    display_name: string
  }
  export function getChannelInvite(
    post: HasRaw & Entity.HaveEntityWrapper
  ): ChannelInviteForView | undefined {
    const channelRaw = post.raw?.find(rawIsChannelInvite)
    if (!channelRaw) return
    return {
      ...channelRaw.value,
      display_name:
        channelRaw.value.name || `Channel ${channelRaw.value.channel_id}`,
    }
  }
}

export interface ChannelInvite extends BaseRaw {
  type: typeof ChannelInvite.type
  value: ChannelInvite.Value
}
