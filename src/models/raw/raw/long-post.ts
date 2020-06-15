import { Raw } from '~/models/raw'

export type LongPost = Raw<LongPost.Value>

export namespace LongPost {
  export const type = 'nl.chimpnut.blog.post'
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
      type: 'nl.chimpnut.blog.post',
      value,
    }
  }
}
