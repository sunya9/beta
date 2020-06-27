import { ConfigRepository } from '~/plugins/domain/repository/configStorage'

export class ConfigRepositoryImpl implements ConfigRepository {
  constructor(private readonly localStorage: Storage) {}
  get isEnabledDirectedPosts(): boolean {
    return this.localStorage.hide_directed_posts === 'false'
  }

  get isEnabledUnifiedStream(): boolean {
    return this.localStorage.unified_timeline === 'true'
  }
}
