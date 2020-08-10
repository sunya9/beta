import { BaseRaw, Raw, HasRaw } from '~/entity/raw'
import { Entity } from '~/entity/entity'

export namespace Crosspost {
  export const type = 'io.pnut.core.crosspost' as const
  export interface Value {
    canonical_url: string
  }
  export function rawIsCrosspost(raw: Raw): raw is Crosspost {
    return raw.type === Crosspost.type
  }

  export function getCrosspostLink(post: HasRaw & Entity.HaveEntityWrapper) {
    return post.raw?.find(rawIsCrosspost)?.value.canonical_url
  }
}

export interface Crosspost extends BaseRaw {
  type: typeof Crosspost.type
  value: Crosspost.Value
}
