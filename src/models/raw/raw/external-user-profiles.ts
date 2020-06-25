import { BaseRaw } from '~/models/raw'

export namespace ExternalUserProfiles {
  export const type = 'me.rafaelcosta.user.profiles' as const
  export interface Value {
    service: string
    id?: string
    url?: string
    text?: string
  }
}

export interface ExternalUserProfiles extends BaseRaw {
  type: typeof ExternalUserProfiles.type
  value: ExternalUserProfiles.Value
}
