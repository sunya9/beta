import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  PostIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
  ExploreSlugType,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import {
  SearchUsersRequest,
  GeneralUserParameters,
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

export class PnutRepositoryImpl implements PnutRepository {
  constructor(private readonly axios: NuxtAxiosInstance) {}
  getUser(
    userId: UserId,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User>> {
    return this.get(`/users/${userId}`, params)
  }

  getUnifiedStream(
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.get('/posts/streams/unified', params)
  }

  getTaggedPosts(
    tag: string,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.get(`/posts/tags/${tag}`, params)
  }

  getUserPosts(
    userId: UserId,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.get(`/users/${userId}/posts`, params)
  }

  getMessages(
    channelId: string,
    params?: GeneralMessageParameters
  ): Promise<PnutResponse<Message[]>> {
    return this.get(`/channels/${channelId}/messages`, params)
  }

  searchUsers(params: SearchUsersRequest): Promise<PnutResponse<User[]>> {
    return this.get('/users/search', params)
  }

  createPrivateChannel(
    createPrivateChannelRequest: CreatePrivateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Message>> {
    return this.post(
      '/channels/pm/messages',
      createPrivateChannelRequest,
      params
    )
  }

  createChannel(
    createChannelRequest: CreateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel>> {
    return this.post('/channels', createChannelRequest, params)
  }

  createMessage(
    channelId: string,
    message: CreateMessageRequest,
    params?: GeneralMessageParameters
  ): Promise<PnutResponse<Message>> {
    return this.post(`/channels/${channelId}/messages`, message, {
      ...params,
      update_marker: true,
    })
  }

  updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post>> {
    return this.put(`/posts/${postId}`, updatePostRequest, params)
  }

  private put(url: string, data: any, params?: any) {
    return this.axios.$put(url, data, { params })
  }

  private post(url: string, data: any, params?: any) {
    return this.axios.$post(url, data, { params })
  }

  private get(url: string, params?: any) {
    return this.axios.$get(url, { params })
  }

  createPost(
    createPostRequest: CreatePostRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post>> {
    return this.post('/posts', createPostRequest, params)
  }

  getFile(
    fileIdRequest: FileIdRequest,
    params?: GeneralFileParameters
  ): Promise<PnutResponse<File>> {
    return this.axios.$get(`/files/${fileIdRequest.file_id}`, {
      params,
    })
  }

  postPoll(
    poll: CreatePollRequest,
    fallbackText?: string
  ): Promise<PnutResponse<Poll>> {
    return this.axios.$post('/polls', {
      ...poll,
      prompt: poll.prompt || fallbackText,
    })
  }

  uploadFile(data: FormData): Promise<PnutResponse<File>> {
    return this.axios.$post('/files', data, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  getMentions(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/users/me/mentions', { params })
  }

  getInteractions(
    postIdRequest: PostIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Interaction<any>[]>> {
    return this.axios.$get(`/posts/${postIdRequest.post_id}/interactions`, {
      params,
    })
  }

  getBookmarks(
    userId: string,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.axios.$get(`/users/${userId}/bookmarks`, {
      params,
    })
  }

  getExplore(
    slug: ExploreSlugType,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.axios.$get(`/posts/streams/explore/${slug}`, { params })
  }

  getGlobal(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/posts/streams/global', { params })
  }

  getHomeStream(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/posts/streams/me', { params })
  }
}
