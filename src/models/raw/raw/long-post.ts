import { BaseRaw } from '~/models/raw'

export namespace LongPost {
  export const type = 'nl.chimpnut.blog.post' as const
  export interface Value {
    body: string
    title?: string
    tstamp: string
  }
  export function createLongpostRaw(
    value: LongPost.Value | null
  ): LongPost | undefined {
    if (!value) return
    return {
      type: LongPost.type,
      value,
    }
  }
}

export interface LongPost extends BaseRaw {
  type: typeof LongPost.type
  value: LongPost.Value
}
