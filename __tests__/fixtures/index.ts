import path from 'path'
import { merge, cloneDeep } from 'lodash'

export default function fixtures<T>(
  filepath: string,
  ...overrides: string[]
): T {
  const defExport: {
    default: T
    [key: string]: Partial<T>
  } = require(path.resolve(__dirname, filepath))
  return overrides
    ? overrides.reduce<T>(
        (res, key) => merge<{}, T, Partial<T>>({}, res, defExport[key]),
        defExport.default
      )
    : cloneDeep(defExport.default)
}
