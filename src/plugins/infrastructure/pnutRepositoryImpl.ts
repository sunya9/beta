import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  GetExploreStreamRequest,
  PostIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import { UserIdRequest } from '~/plugins/domain/dto/user'
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

export class PnutRepositoryImpl implements PnutRepository {
  constructor(private readonly axios: NuxtAxiosInstance) {}
  createPrivateChannel(
    createPrivateChannelRequest: CreatePrivateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Message>> {
    return this.post('/channels/pm/messages', createPrivateChannelRequest, {
      params,
    })
  }

  createChannel(
    createChannelRequest: CreateChannelRequest,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel>> {
    return this.post('/channels', createChannelRequest, { params })
  }

  createMessage(
    channelId: string,
    message: CreateMessageRequest,
    params?: GeneralMessageParameters
  ): Promise<PnutResponse<Message>> {
    return this.post(`/channels/${channelId}/messages`, message, {
      params: {
        ...params,
        update_marker: true,
      },
    })
  }

  updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post>> {
    return this.put(`/posts/${postId}`, updatePostRequest, { params })
  }

  private put(url: string, data: any, params?: any) {
    return this.axios.$put(url, data, { params })
  }

  private post(url: string, data: any, params?: any) {
    return this.axios.$post(url, data, { params })
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
    userIdRequest: UserIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.axios.$get(`/users/${userIdRequest.user_id}/bookmarks`, {
      params,
    })
  }

  getExplore(
    explore: GetExploreStreamRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.axios.$get(`/posts/streams/explore/${explore.slug}`, { params })
  }

  getGlobal(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/posts/streams/global', { params })
  }

  getHomeStream(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/posts/streams/me', { params })
  }
}
