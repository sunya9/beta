import { BaseRaw } from '~/models/raw'

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
}

export interface Spoiler extends BaseRaw {
  type: typeof Spoiler.type
  value: Spoiler.Value
}
