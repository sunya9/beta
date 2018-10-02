import moment from 'moment'

moment.updateLocale('en', {
  relativeTime: {
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh'
  }
})

export default {
  props: {
    lastUpdate: {
      type: Number,
      default: null
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemDate() {
      return this.$options.dateKey
        .split('.')
        .reduce((obj, key) => obj[key], this)
    },
    date() {
      const now = moment(this.lastUpdate)
      const postDate = moment(this.itemDate)
      if (now.diff(postDate, 'day') >= 1) {
        const lastYear =
          now.toDate().getFullYear() - postDate.toDate().getFullYear()
        const format = lastYear ? 'D MMM YY' : 'D MMM'
        return postDate.format(format)
      } else {
        return postDate.fromNow(true)
      }
    },
    absDate() {
      return moment(this.itemDate).format('YYYY/MM/DD HH:mm:ss')
    }
  }
}
