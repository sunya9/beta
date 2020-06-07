import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import {
  GeneralPostParameters,
  GetExploreStreamRequest,
  PostIdRequest,
  CreatePostRequest,
} from '~/plugins/domain/dto/post'
import { Interaction } from '~/models/interaction'
import { UserIdRequest } from '~/plugins/domain/dto/user'
import { File } from '~/models/file'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'
import { GeneralFileParameters, FileIdRequest } from '~/plugins/domain/dto/file'

export interface PnutRepository {
  getHomeStream(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getMentions(params?: GeneralPostParameters): Promise<PnutResponse<Post[]>>
  getInteractions(
    postIdRequest: PostIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Interaction<any>[]>>
  getBookmarks(
    userIdRequest: UserIdRequest,
    params?: GeneralPostParameters
  ): Promise<PnutResponse<Post[]>>
  getExplore(
    explore: GetExploreStreamRequest,
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
}
