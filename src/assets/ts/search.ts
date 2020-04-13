import Vue from 'vue'
import { User } from '~/models/user'
import { Post } from '~/models/post'
import { PnutResponse } from '~/models/pnut-response'

export default Vue.extend({
  watchQuery: ['q'],
  key: (to) => to.fullPath,
  data() {
    return {
      options: {
        q: '',
      },
      data: ({} as any) as PnutResponse<Post[] | User[]> | null,
    }
  },
  computed: {
    title(): string | null {
      if (!this.$route || !this.$route.path || !this.$route.query) return null
      const { q } = this.$route.query
      if (!q || typeof q !== 'string') return null
      const type = this.$route.path.replace(/^\/search\//, '')
      return `Search ${type} for "${decodeURIComponent(q)}"`
    },
  },
  watch: {
    '$route.query.q'(q) {
      this.options = {
        ...this.options,
        q: encodeURIComponent(q),
      }
    },
    async options(options) {
      this.data = await this.$resource<User[] | Post[]>(options)
    },
  },
})
