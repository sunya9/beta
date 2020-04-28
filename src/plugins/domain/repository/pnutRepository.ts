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
}
