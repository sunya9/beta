import { Pagination } from '~/plugins/domain/dto/common'

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
