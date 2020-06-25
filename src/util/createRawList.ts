import { Raw } from '~/models/raw'

export function createRawList(
  ...nullableRawList: Array<Raw | undefined>
): Raw[] {
  return nullableRawList.filter(
    (nullableRaw): nullableRaw is Raw => !!nullableRaw
  )
}
