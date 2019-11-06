import { User } from './user'
import { Entity } from './entity'
import { Raw } from './raw'

export interface Post {
  created_at: Date;
  id: string;
  is_deleted: boolean;
  is_nsfw: boolean;
  is_revised: boolean;
  revision?: string;
  source: {
    name: string;
    link: string;
    id: string;
  };
  user?: User;
  thread_id: string;
  reply_to?: string;
  repost_of?: Post;
  counts?: {
    bookmarks: number;
    replies: number;
    reposts: number;
    threads: number;
  };
  content?: Post.PostContent;
  you_bookmarked?: boolean;
  you_reposted: boolean;
  raw?: Raw<any>[];
}

export namespace Post {
  interface PostContent extends Entity.HaveEntity {
    links_not_parsed: boolean;
  }
}
