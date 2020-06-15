import { Raw } from '~/models/raw'

export function createRawList(
  ...nullableRawList: Array<Raw<any> | undefined>
): Raw<any>[] {
  return nullableRawList.filter(
    (nullableRaw): nullableRaw is Raw<any> => !!nullableRaw
  )
}
