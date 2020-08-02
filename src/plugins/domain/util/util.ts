import { Pagination, FetchMoreResult } from '~/plugins/domain/dto/common'
import { PnutResponse } from '~/entity/pnut-response'

export type InsertPosition = 'first' | 'last'

export function getInserPosition(
  pagination?: Pick<Pagination, 'before_id' | 'since_id'>
): InsertPosition | undefined {
  if (pagination?.before_id) return 'last'
  if (pagination?.since_id) return 'first'
}

export function composeList<T>(props: {
  newData: T[]
  data?: T[]
  insertPosition?: InsertPosition
}) {
  if (!props.data) return props.newData
  if (props.insertPosition === 'first') return [...props.newData, ...props.data]
  if (props.insertPosition === 'last') return [...props.data, ...props.newData]
  return props.newData
}

type GetPnutResponse<I extends Pagination, T> = (
  config?: I
) => Promise<PnutResponse<T[]>>

interface FetchMoreProps<I extends Pagination, T> {
  getPnutResponse: GetPnutResponse<Partial<I>, T>
  firstData: T[]
  firstMeta: PnutResponse.Meta
  input: Partial<I>
}

function createGetNewer<I extends Pagination, T>({
  getPnutResponse,
  firstData,
  firstMeta,
  input,
}: FetchMoreProps<I, T>) {
  return async () => {
    const config = {
      ...input,
      before_id: undefined,
      since_id: firstMeta.max_id,
    }
    const { data, meta } = await getPnutResponse(config)
    firstData.unshift(...data)
    Object.assign(firstMeta, meta)
    return {
      size: data.length,
      data,
    }
  }
}

function createGetOlder<I extends Pagination, T>({
  getPnutResponse,
  firstData,
  firstMeta,
  input,
}: FetchMoreProps<I, T>) {
  return async () => {
    const config = {
      ...input,
      since_id: undefined,
      before_id: firstMeta.min_id,
    }
    const { data, meta } = await getPnutResponse(config)
    firstData.push(...data)
    Object.assign(firstMeta, meta)
    return {
      size: data.length,
      data,
    }
  }
}
export async function createListInfo<I extends Pagination, T>(
  getPnutResponse: GetPnutResponse<Partial<I>, T>,
  input?: I
) {
  const firstRes = await getPnutResponse(input)
  const firstData = composeList({
    newData: firstRes.data,
    data: [],
    insertPosition: getInserPosition(input),
  })
  const olderMeta = {
    ...firstRes.meta,
  }
  const newerMeta = {
    ...firstRes.meta,
  }
  return {
    olderMeta,
    newerMeta,
    data: firstData,
    getNewer: createGetNewer({
      getPnutResponse,
      firstData,
      firstMeta: newerMeta,
      input: { ...input },
    }),
    getOlder: createGetOlder({
      getPnutResponse,
      firstData,
      firstMeta: olderMeta,
      input: { ...input },
    }),
  }
}

export interface ListInfo<T> {
  newerMeta: PnutResponse.Meta
  olderMeta: PnutResponse.Meta
  getNewer: () => Promise<FetchMoreResult<T>>
  getOlder: () => Promise<FetchMoreResult<T>>
  data: T[]
}
