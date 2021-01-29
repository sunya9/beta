import { Pagination } from '~/plugins/domain/dto/common'
import { PnutResponse } from '~/entity/pnut-response'

export enum Direction {
  First,
  Last,
}

export function getInsertPosition(
  pagination?: Pick<Pagination, 'before_id' | 'since_id'>
): Direction {
  if (pagination?.since_id) return Direction.First
  return Direction.Last
}

type GetPnutResponse<T> = (config?: Pagination) => Promise<PnutResponse<T[]>>

interface FetchMoreProps<T> {
  getPnutResponse: GetPnutResponse<T>
  meta: PnutResponse.Meta
  direction: Direction
}

function createMore<T>({
  getPnutResponse,
  meta,
  direction,
}: FetchMoreProps<T>) {
  const config =
    direction === Direction.First
      ? {
          before_id: undefined,
          since_id: meta.max_id,
        }
      : {
          since_id: undefined,
          before_id: meta.min_id,
        }
  return getPnutResponse(config)
}

export async function createListInfo<T>(
  getPnutResponse: GetPnutResponse<T>
): Promise<ListInfo<T>> {
  const { meta: initialMeta, data: initialData } = await getPnutResponse()
  const olderMeta = {
    ...initialMeta,
  }
  const newerMeta = {
    ...initialMeta,
  }
  return {
    olderMeta,
    newerMeta,
    data: initialData,
    getNewer: async () => {
      const { data, meta } = await createMore({
        getPnutResponse,
        meta: newerMeta,
        direction: Direction.First,
      })
      initialData.unshift(...data)
      Object.assign(newerMeta, meta)
      return {
        data,
        size: data.length,
      }
    },
    getOlder: async () => {
      const { data, meta } = await createMore({
        getPnutResponse,
        meta: olderMeta,
        direction: Direction.Last,
      })
      initialData.push(...data)
      Object.assign(olderMeta, meta)
      return {
        data,
        size: data.length,
      }
    },
  }
}

export interface ListInfo<T> {
  newerMeta: PnutResponse.Meta
  olderMeta: PnutResponse.Meta
  getNewer: () => Promise<FetchMoreResult<T>>
  getOlder: () => Promise<FetchMoreResult<T>>
  data: T[]
}

interface FetchMoreResult<T> {
  size: number
  data: T[]
}
