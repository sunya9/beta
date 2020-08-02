import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/entity/pnut-response'
import { Post } from '~/entity/post'
import {
  GeneralPostParameters,
  PostIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
  ExploreSlugType,
  SearchPostRequest,
  HomeStreamRequest,
  MentionRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/entity/interaction'
import {
  SearchUsersRequest,
  GeneralUserParameters,
  GetInteractionParameters,
  UpdateUserRequest,
} from '~/plugins/domain/dto/user'
import { File } from '~/entity/file'
import {
  CreatePollRequest,
  GeneralPollParameters,
  GetPollRequest,
} from '~/plugins/domain/dto/poll'
import { Poll } from '~/entity/poll'
import { GeneralFileParameters, FileIdRequest } from '~/plugins/domain/dto/file'
import {
  CreateMessageRequest,
  GeneralMessageParameters,
} from '~/plugins/domain/dto/message'
import { Message } from '~/entity/message'
import {
  CreateChannelRequest,
  GeneralChannelParameters,
  CreatePrivateChannelRequest,
  SearchChannelRequest,
  GetUnreadCountRequest,
} from '~/plugins/domain/dto/channel'
import { Channel } from '~/entity/channel'
import { User } from '~/entity/user'
import {
  UserId,
  Pagination,
  ConnectionParameters,
} from '~/plugins/domain/dto/common'
import { Stats } from '~/entity/stats'
import { PostMarkerRequest } from '~/plugins/domain/dto/marker'
import { Marker } from '~/entity/marker'

export class PnutRepositoryImpl implements PnutRepository {
  constructor(private readonly axios: NuxtAxiosInstance) {}
  updateUser(
    updateUserRequest: UpdateUserRequest
  ): Promise<PnutResponse<User>> {
    return this.put(`/users/me`, updateUserRequest)
  }

  block(userId: string): Promise<PnutResponse<User>> {
    return this.put(`/users/${userId}/block`)
  }

  unblock(userId: string): Promise<PnutResponse<User>> {
    return this.delete(`/users/${userId}/block`)
  }

  mute(userId: string): Promise<PnutResponse<User>> {
    return this.put(`/users/${userId}/mute`)
  }

  unmute(userId: string): Promise<PnutResponse<User>> {
    return this.delete(`/users/${userId}/mute`)
  }

  follow(userId: string): Promise<PnutResponse<User>> {
    return this.put(`/users/${userId}/follow`)
  }

  unfollow(userId: string): Promise<PnutResponse<User>> {
    return this.delete(`/users/${userId}/follow`)
  }

  postMarker(
    postMarkerRequest: PostMarkerRequest
  ): Promise<PnutResponse<Marker>> {
    return this.post('/markers', postMarkerRequest)
  }

  getUnread(params?: GetUnreadCountRequest): Promise<PnutResponse<any>> {
    return this.get('/users/me/channels/num_unread', params)
  }

  getChannels(
    params?: GeneralChannelParameters & ConnectionParameters
  ): Promise<PnutResponse<Channel[]>> {
    return this.get('/channels', params)
  }

  getRevision(
    postId: string,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>> {
    return this.get(`/posts/${postId}/revisions`, params)
  }

  getPoll(
    pollId: string,
    params?: GetPollRequest
  ): Promise<PnutResponse<Poll>> {
    return this.get(`/polls/${pollId}`, params)
  }

  getPolls(
    params?: GeneralPollParameters & Pagination
  ): Promise<PnutResponse<Poll[]>> {
    return this.get('/users/me/polls', params)
  }

  getFiles(
    params?: GeneralFileParameters & Pagination
  ): Promise<PnutResponse<File[]>> {
    return this.get('/users/me/files', params)
  }

  getThread(
    postId: string,
    params?: GeneralPostParameters & Pagination
  ): Promise<PnutResponse<Post[]>> {
    return this.get(`/posts/${postId}/thread`, params)
  }

  searchPosts(
    params?: SearchPostRequest & Pagination
  ): Promise<PnutResponse<Post[]>> {
    return this.get('/posts/search', params)
  }

  getStats(): Promise<PnutResponse<Stats>> {
    return this.get('/sys/stats')
  }

  getMutedUsers(
    params?: GeneralChannelParameters & Pagination
  ): Promise<PnutResponse<User[]>> {
    return this.get('/users/me/muted', params)
  }

  getBlockedUsers(
    params?: GeneralChannelParameters & Pagination
  ): Promise<PnutResponse<User[]>> {
    return this.get('/users/me/blocked', params)
  }

  getChannel(
    channelId: string,
    params?: GeneralChannelParameters
  ): Promise<PnutResponse<Channel>> {
    return this.get(`/channels/${channelId}`, params)
  }

  searchChannels(
    params?: SearchChannelRequest
  ): Promise<PnutResponse<Channel[]>> {
    return this.get('/channels/search', params)
  }

  getSubscribedChannels(
    params?: GeneralChannelParameters & ConnectionParameters
  ): Promise<PnutResponse<Channel[]>> {
    return this.get('/users/me/channels/subscribed', params)
  }

  getFollowers(
    userId: string,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User[]>> {
    return this.get(`/users/${userId}/followers`, params)
  }

  getFollowing(
    userId: string,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User[]>> {
    return this.get(`/users/${userId}/following`, params)
  }

  getInteractions(
    params?: GetInteractionParameters
  ): Promise<PnutResponse<Interaction[]>> {
    return this.get('/users/me/interactions', params)
  }

  getUser(
    userId: UserId,
    params?: GeneralUserParameters
  ): Promise<PnutResponse<User>> {
    return this.get(`/users/${userId}`, params)
  }

  getUnifiedStream(params?: HomeStreamRequest): Promise<PnutResponse<Post[]>> {
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

  private put(url: string, data?: any, params?: any) {
    return this.axios.$put(url, data, { params })
  }

  private delete(url: string, params?: any) {
    return this.axios.$delete(url, { params })
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

  getMentions(params?: MentionRequest): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/users/me/mentions', { params })
  }

  getPostInteractions(
    postIdRequest: PostIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Interaction[]>> {
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

  getHomeStream(params?: HomeStreamRequest): Promise<PnutResponse<Post[]>> {
    return this.axios.$get('/posts/streams/me', { params })
  }
}
