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
    this.created_at = message.created_at
    this.channel_id = message.channel_id
    this.id = message.id
    this.is_deleted = message.is_deleted
    this.is_sticky = message.is_sticky
    this.source = message.source
    this.reply_to = message.reply_to
    this.thread_id = message.thread_id
    this.content = message.content
    this.deleted_by = message.deleted_by
    this.raw = message.raw
  }

  created_at: Date
  channel_id: string
  id: string
  is_deleted: boolean
  is_sticky: boolean
  source: Client.Source
  reply_to?: string
  thread_id: string
  content?: Entity.HaveEntity
  deleted_by?: boolean
  raw?: Raw[]

  get user() {
    return this.message.user && new UserEntity(this.message.user)
  }
}
