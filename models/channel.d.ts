import { User } from './user'
import { Message } from './message'

export interface Channel {
  id: string;
  is_active: boolean;
  type: string;
  owner?: User;
  recent_message_id?: string;
  recent_message?: Message;
  acl: Channel.Acl;
  counts: {
    messages: number;
    subscribers: number;
  };
  you_subscribed: boolean;

  you_muted: boolean;
  has_unread: boolean;
}

export namespace Channel {
  export interface Acl {
    full: {
      immutable: boolean;
      you: boolean;
      user_ids: string[] | User[];
    };
    write: {
      any_user: boolean;
      immutable: boolean;
      you: boolean;
      user_ids: string[] | User[];
    };
    read: {
      any_user: boolean;
      immutable: boolean;
      public: boolean;
      you: boolean;
      user_ids: string[] | User[];
    };
  }
}
