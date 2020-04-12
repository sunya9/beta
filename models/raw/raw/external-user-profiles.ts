import { Raw } from '~/models/raw'

export type ExternalUserProfiles = Raw<ExternalUserProfiles.Value>

export namespace ExternalUserProfiles {
  export const type = 'me.rafaelcosta.user.profiles'
  export interface Value {
    service: string
    id?: string
    url?: string
    text?: string
  }
}
