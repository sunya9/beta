export interface Raw<T> {
  type: string
  value: T
}

export interface HasRaw {
  raw?: Raw<any>[]
}
