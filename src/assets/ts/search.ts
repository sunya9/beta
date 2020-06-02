import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { User } from '~/models/user'
import { Post } from '~/models/post'
import { PnutResponse } from '~/models/pnut-response'

@Component({
  watchQuery: ['q'],
  key: (to) => to.fullPath,
})
export default class Search extends Vue {
  options = {
    q: '',
  }

  data!: PnutResponse<Post[] | User[]> | null

  get title(): string {
    if (!this.$route || !this.$route.path || !this.$route.query) return ''
    const { q } = this.$route.query
    if (!q || typeof q !== 'string') return ''
    const type = this.$route.path.replace(/^\/search\//, '')
    return `Search ${type} for "${decodeURIComponent(q)}"`
  }

  @Watch('$route.query.q')
  onChangeQuery(q: string) {
    this.options = {
      ...this.options,
      q: encodeURIComponent(q),
    }
  }

  @Watch('options')
  async onChangeOptions(options: Search['options']) {
    this.data = await this.$resource<User[] | Post[]>({ options })
  }
}
