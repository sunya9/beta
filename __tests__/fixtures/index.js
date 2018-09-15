import { merge, cloneDeep } from 'lodash'
import path from 'path'

export default function fixtures(filepath, ...overrides) {
  const defExport = require(path.resolve(__dirname, filepath))
  return overrides
    ? overrides.reduce(
        (res, key) => merge({}, res, defExport[key]),
        defExport.default
      )
    : cloneDeep(defExport.default)
}
