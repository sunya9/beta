import { merge, cloneDeep } from 'lodash'
import path from 'path'

export default function fixtures(filepath, overrides) {
  const defExport = require(path.resolve(__dirname, filepath))
  return overrides
    ? merge({}, defExport.default, defExport[overrides])
    : cloneDeep(defExport.default)
}
