import moment from 'moment'
import { Plugin } from '@nuxt/types'

moment.updateLocale('en', {
  relativeTime: {
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh'
  }
})

const plugin: Plugin = (_, inject) => {
  inject('moment', moment)
}

export default plugin
