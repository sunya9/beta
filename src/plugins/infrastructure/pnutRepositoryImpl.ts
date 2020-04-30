import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  GetExploreStreamRequest,
  PostIdRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import { UserIdRequest } from '~/plugins/domain/dto/user'
import { File } from '~/models/file'
import { PostPollRequest } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'

export class PnutRepositoryImpl implements PnutRepository {
  constructor(private readonly axios: NuxtAxiosInstance) {}
  postPoll(
    poll: PostPollRequest,
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
