import dayjs from 'dayjs'
import { Plugin } from '@nuxt/types'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

dayjs.updateLocale('en', {
  relativeTime: {
    ...dayjs.Ls.en.relativeTime,
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
  },
})

const plugin: Plugin = (_, inject) => {
  inject('dayjs', dayjs)
}

export default plugin
