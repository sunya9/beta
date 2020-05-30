import { User } from './user'
import { Entity } from './entity'
import { Client } from './client'
import { HasRaw } from './raw'

export interface Message extends HasRaw {
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
