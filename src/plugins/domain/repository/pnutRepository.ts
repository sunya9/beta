import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  ExploreSlugType,
  PostIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import {
  SearchUsersRequest,
  GeneralUserParameters,
  GetInteractionParameters,
} from '~/plugins/domain/dto/user'
import { File } from '~/models/file'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'
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
} from '~/plugins/domain/dto/channel'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'
import { UserId } from '~/plugins/domain/dto/common'

export interface PnutRepository {
  getHomeStream(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getMentions(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getPostInteractions(
    postIdRequest: PostIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Interaction<any>[]>>
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
  ): Promise<PnutResponse<Interaction<any>[]>>
}
