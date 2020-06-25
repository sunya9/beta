import { User } from './user'
import { Client } from './client'

export interface Token {
  app: Client.Source
  scopes: Token.Scope[]
  user: User
  storage: Token.Storage
}

export namespace Token {
  export namespace Scope {
    export const basic = 'basic' as const
    export const stream = 'stream' as const
    export const write_post = 'write_post' as const
    export const follow = 'follow' as const
    export const update_profile = 'update_profile' as const
    export const presence = 'presence' as const
    export const messages = 'messages' as const
    export const pm = 'messages:io.pnut.core.pm' as const
    export const public_messages = 'public_messages' as const
    export const files = 'files' as const
    export const polls = 'polls' as const
    export const email = 'email' as const
  }
  export type Scope =
    | typeof Scope.basic
    | typeof Scope.stream
    | typeof Scope.write_post
    | typeof Scope.follow
    | typeof Scope.update_profile
    | typeof Scope.presence
    | typeof Scope.messages
    | typeof Scope.pm
    | typeof Scope.public_messages
    | typeof Scope.files
    | typeof Scope.polls
    | typeof Scope.email
  export interface Storage {
    available: number
    total: number
  }
}
