import { File } from '~/entity/file'

export interface ModifiedFile extends File {
  select: boolean
}
