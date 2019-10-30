import { User } from './user'
import { Entity } from './entity'
import { Client } from './client'

export interface Message {
  created_at: Date;
  id: string;
  is_deleted: boolean;
  is_sticky: boolean;
  source: Client.Source;
  reply_to?: string;
  thread_id: string;
  user?: User;
  content?: Message.MessageContent;
}

export namespace Message {
  type MessageContent = Entity.HaveEntity
}
