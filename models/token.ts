import { User } from './user'
import { Client } from './client'

export interface Token {
  app: Client.Source
  scopes: Token.Scope[]
  user: User
  storage: Token.Storage
}

export namespace Token {
  export enum Scope {
    basic,
    stream,
    write_post,
    follow,
    update_profile,
    presence,
    messages,
    'messages:io.pnut.core.pm',
    public_messages,
    files,
    polls,
    email
  }
  export interface Storage {
    available: number
    total: number
  }
}
