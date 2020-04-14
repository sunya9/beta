export type Pagination = {
  since_id?: string
  before_id?: string
  count?: number
}

export type IdsRequest = {
  ids: string[]
}
