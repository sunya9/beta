import { BaseRaw, HasRaw } from '~/entity/raw'

export namespace Spoiler {
  export const type = 'shawn.spoiler' as const
  export interface Value {
    topic: string
    expired_at?: string
  }
  export function createSpoilerRaw(
    value: Spoiler.Value | null
  ): Spoiler | undefined {
    if (!value) return
    return {
      type: 'shawn.spoiler',
      value,
    }
  }

  export function getSpoiler(hasRaw?: HasRaw): Spoiler.Value | undefined {
    return hasRaw?.raw?.find((r): r is Spoiler => {
      return (
        r.type === 'shawn.spoiler' &&
        !!r.value.topic &&
        (!r.value.expired_at || new Date(r.value.expired_at) > new Date())
      )
    })?.value
  }
}

export interface Spoiler extends BaseRaw {
  type: typeof Spoiler.type
  value: Spoiler.Value
}
