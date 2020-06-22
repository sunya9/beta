import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  ExploreSlugType,
  PostIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
  SearchPostRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import {
  SearchUsersRequest,
  GeneralUserParameters,
  GetInteractionParameters,
} from '~/plugins/domain/dto/user'
import { File } from '~/models/file'
import {
  CreatePollRequest,
  GeneralPollParameters,
} from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'
import { GeneralFileParameters, FileIdRequest } from '~/plugins/domain/dto/file'
import {
  CreateMessageRequest,
  GeneralMessageParameters,
} from '~/plugins/domain/dto/message'
import { Message } from '~/models/message'
import {
  CreateChannelRequest,
  GeneralChannelParameters,
  CreatePrivateChannelRequest,
  SearchChannelRequest,
} from '~/plugins/domain/dto/channel'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'
import { UserId, Pagination } from '~/plugins/domain/dto/common'
import { Stats } from '~/models/stats'

export interface PnutRepository {
  getHomeStream(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getMentions(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getPostInteractions(
    postIdRequest: PostIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Interaction[]>>
  getBookmarks(
    userId: string,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>
  getExplore(
    slug: ExploreSlugType,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>
  getGlobal(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  uploadFile(data: FormData): Promise<PnutResponse<File>>
  postPoll(
    poll: CreatePollRequest,
    fallbackText?: string
  ): Promise<PnutResponse<Poll>>

  getFile(
    file: FileIdRequest,
    params?: GeneralFileParameters
  ): Promise<PnutResponse<File>>

  createPost(
    createPostRequest: CreatePostRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post>>

  updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post>>

  createMessage(
    channelId: string,
    message: CreateMessageRequest,
    params?: GeneralMessageParameters
  ): Promise<PnutResponse<Message>>

  createChannel(
    createChannelRequest: CreateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel>>

  createPrivateChannel(
    createPrivateChannelRequest: CreatePrivateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Message>>

  searchUsers(params: SearchUsersRequest): Promise<PnutResponse<User[]>>
  getMessages(
    channelId: string,
    params?: GeneralMessageParameters
  ): Promise<PnutResponse<Message[]>>
  getUserPosts(
    userId: UserId,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>

  getTaggedPosts(
    tag: string,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>
  getUnifiedStream(
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>
  getUser(
    userId: UserId,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User>>
  getInteractions(
    params?: GetInteractionParameters
  ): Promise<PnutResponse<Interaction[]>>
  getFollowers(
    userId: UserId,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User[]>>
  getFollowing(
    userId: UserId,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User[]>>

  getSubscribedChannels(
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel[]>>

  searchChannels(
    params?: SearchChannelRequest
  ): Promise<PnutResponse<Channel[]>>
  getChannel(
    channelId: string,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel>>

  getBlockedUsers(
    params?: GeneralChannelParameters & Pagination
  ): Promise<PnutResponse<User[]>>

  getMutedUsers(
    params?: GeneralChannelParameters & Pagination
  ): Promise<PnutResponse<User[]>>

  getStats(): Promise<PnutResponse<Stats>>
  searchPosts(
    params?: SearchPostRequest & GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>

  getThread(
    postId: string,
    params?: GeneralPostParameters & Pagination
  ): Promise<PnutResponse<Post[]>>
  getFiles(
    params?: GeneralFileParameters & Pagination
  ): Promise<PnutResponse<File[]>>

  getPolls(
    params?: GeneralPollParameters & Pagination
  ): Promise<PnutResponse<Poll[]>>
}
