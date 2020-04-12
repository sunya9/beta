import Vue from 'vue'

export default (dateKey: string) =>
  Vue.extend({
    props: {
      lastUpdate: {
        type: Number,
        default: null,
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      itemDate(): Date {
        // TODO
        return dateKey.split('.').reduce((obj, key) => obj[key], this as any)
      },
      date(): string {
        const now = this.$moment(this.lastUpdate)
        const postDate = this.$moment(this.itemDate)
        if (now.diff(postDate, 'day') >= 1) {
          const lastYear =
            now.toDate().getFullYear() - postDate.toDate().getFullYear()
          const format = lastYear ? 'D MMM YY' : 'D MMM'
          return postDate.format(format)
        } else {
          return postDate.fromNow(true)
        }
      },
      absDate(): string {
        return this.$moment(this.itemDate).format('YYYY/MM/DD HH:mm:ss')
      },
    },
  })
