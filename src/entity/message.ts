import { User, UserEntity } from './user'
import { Entity } from './entity'
import { Client } from './client'
import { HasRaw, Raw } from './raw'

export interface Message extends HasRaw, Entity.HaveEntityWrapper {
  created_at: Date
  channel_id: string
  id: string
  is_deleted: boolean
  is_sticky: boolean
  source: Client.Source
  reply_to?: string
  thread_id: string
  user?: User
  content?: Message.MessageContent
  deleted_by?: boolean // Really?
}

export namespace Message {
  export type MessageContent = Entity.HaveEntity
}

export class MessageEntity implements Message {
  constructor(private readonly message: Message) {
    Object.assign(this, message)
  }

  created_at!: Date
  channel_id!: string
  id!: string
  is_deleted!: boolean
  is_sticky!: boolean
  source!: Client.Source
  reply_to!: string | undefined
  thread_id!: string
  get user() {
    return this.message.user && new UserEntity(this.message.user)
  }

  content!: Entity.HaveEntity | undefined
  deleted_by!: boolean | undefined
  raw!: Raw[] | undefined
}
