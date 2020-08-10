import { BaseRaw, Raw, HasRaw } from '~/entity/raw'
import { Entity } from '~/entity/entity'

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

  export function rawIsLongPost(raw: Raw): raw is LongPost {
    return raw.type === LongPost.type
  }

  export function getLongpost(
    post: HasRaw & Entity.HaveEntityWrapper
  ): LongPost.Value | undefined {
    return post.raw?.find(rawIsLongPost)?.value
  }
}

export interface LongPost extends BaseRaw {
  type: typeof LongPost.type
  value: LongPost.Value
}
