import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { SearchPostRequest } from '~/plugins/domain/dto/post'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'
import { User } from '~/models/user'
import { Post } from '~/models/post'
import { Pagination } from '~/plugins/domain/dto/common'
import { SearchUsersRequest } from '~/plugins/domain/dto/user'

type SearchClass = 'post' | 'user'

type Input =
  | {
      type: 'post'
      params?: SearchPostRequest & Pagination
    }
  | {
      type: 'user'
      params?: SearchUsersRequest & Pagination
    }
type Output =
  | {
      listInfo: ListInfo<Post>
      type: 'post'
      title: string
    }
  | {
      type: 'user'
      listInfo: ListInfo<User>
      title: string
    }

function getTitle({ q, type }: { q?: string; type: SearchClass }) {
  if (!q || typeof q !== 'string') return ''
  return `Search ${type} for "${decodeURIComponent(q)}"`
}

export interface SearchUseCase extends UseCase<Input, Promise<Output>> {}

export namespace SearchUseCase {
  export const token = class {}
}

@singleton()
export class SearchInteractor implements SearchUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const title = getTitle({ q: input.params?.q, type: input.type })
    const commonDefaultParams: Input['params'] = {
      order: 'id',
    }
    switch (input.type) {
      case 'post':
        return {
          listInfo: await createListInfo((config) => {
            return this.pnutRepository.searchPosts({
              ...commonDefaultParams,
              ...input.params,
              ...config,
            })
          }),
          title,
          type: input.type,
        }
      case 'user':
        return {
          listInfo: await createListInfo((config) => {
            return this.pnutRepository.searchUsers({
              ...commonDefaultParams,
              ...input.params,
              ...config,
            })
          }),
          title,
          type: input.type,
        }
    }
  }
}
