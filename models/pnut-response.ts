export interface PnutResponse<T> {
  meta: PnutResponse.Meta
  data: T
}

export namespace PnutResponse {
  export interface Meta {
    more?: boolean
    max_id?: string
    min_id?: string
    marker?: Meta.Marker
    code?: number
  }
  export namespace Meta {
    export interface Marker {
      id?: string
      last_read_id?: string
      percentage?: string
      updated_at?: Date
      version?: string
      name?: string
    }
  }
}
