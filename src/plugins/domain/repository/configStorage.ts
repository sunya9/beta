export namespace ConfigRepository {
  export const token = class {}
}

export interface ConfigRepository {
  readonly isEnabledUnifiedStream: boolean
  readonly isEnabledDirectedPosts: boolean
}
