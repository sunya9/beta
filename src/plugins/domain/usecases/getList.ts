import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutResponse } from '~/models/pnut-response'
import { FetchMoreResult, Pagination } from '~/plugins/domain/dto/common'
import { composeList, getInserPosition } from '~/plugins/domain/util/util'

export interface GetListBaseInput {
  params?: Pagination
}
export interface ListInfo<T> {
  newerMeta: PnutResponse.Meta
  olderMeta: PnutResponse.Meta
  getNewer: () => Promise<FetchMoreResult<T>>
  getOlder: () => Promise<FetchMoreResult<T>>
  data: T[]
}

export interface GetListBaseOutput<T> {
  listInfo: ListInfo<T>
}

export interface GetListUseCase<
  T,
  I extends GetListBaseInput,
  O extends Promise<GetListBaseOutput<T>>
> extends Usecase<I, Promise<O>> {}

export abstract class GetListInteractor<
  T,
  I extends GetListBaseInput,
  O extends Promise<GetListBaseOutput<T>>
> implements GetListUseCase<T, I, O> {
  async run(input: I): Promise<O> {
    const firstRes = await this.getList(input)
    const firstData = composeList({
      newData: firstRes.data,
      data: [],
      insertPosition: getInserPosition(input.params),
    })
    const olderMeta = {
      ...firstRes.meta,
    }
    const newerMeta = {
      ...firstRes.meta,
    }
    return {
      listInfo: {
        olderMeta,
        newerMeta,
        data: firstData,
        getNewer: this.createGetNewer({
          firstData,
          firstMeta: newerMeta,
          input,
        }),
        getOlder: this.createGetOlder({
          firstData,
          firstMeta: olderMeta,
          input,
        }),
      },
    }
  }

  abstract async getList(input: I): Promise<PnutResponse<T[]>>

  createGetNewer({
    firstData,
    firstMeta,
    input,
  }: {
    firstData: T[]
    firstMeta: PnutResponse.Meta
    input: I
  }) {
    return async () => {
      const params: GetListBaseInput['params'] = {
        ...input.params,
        since_id: firstMeta.max_id,
      }
      const { data, meta } = await this.getList({
        ...input,
        params,
      })
      firstData.unshift(...data)
      Object.assign(firstMeta, meta)
      return {
        size: data.length,
        data,
      }
    }
  }

  createGetOlder({
    firstData,
    firstMeta,
    input,
  }: {
    firstData: T[]
    firstMeta: PnutResponse.Meta
    input: I
  }) {
    return async () => {
      const params: GetListBaseInput['params'] = {
        ...input.params,
        before_id: firstMeta.min_id,
      }
      const { data, meta } = await this.getList({
        ...input,
        params,
      })
      firstData.push(...data)
      Object.assign(firstMeta, meta)
      return {
        size: data.length,
        data,
      }
    }
  }
}
