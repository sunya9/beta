import { Entity } from './entity'

export interface User {
  badge?: {
    id: string;
    name: string;
  };
  content?: User.UserContent;
  counts?: {
    bookmarks: number;
    clients: number;
    followers: number;
    following: number;
    posts: number;
    users: number;
  };
  created_at: Date;
  follows_you: boolean;
  id: string;
  locale: string;
  name: string;
  timezone: string;
  type: User.UserType;
  username: string;
  you_blocked: boolean;
  you_can_follow: boolean;
  you_follow: boolean;
  you_muted: boolean;
  verified?: {
    domain: string;
    link: string;
  };
}

export namespace User {
  export enum UserType {
    human,
    feed,
    bot
  }
  interface UserContent extends Entity.HaveEntity {
    avatar_image: UserImage;
    cover_image: UserImage;
    markdown_text?: string;
  }
  interface UserImage {
    link: string;
    is_defualt: boolean;
    width: number;
    height: number;
  }
}
