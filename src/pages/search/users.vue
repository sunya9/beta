<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <user-list :list-info="listInfo">
      <span slot="empty">No results for {{ keyword }}</span>
    </user-list>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Search } from '~/assets/ts/search'
import UserList from '~/components/UserList.vue'
import { User } from '~/models/user'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    UserList,
  },
  head(this: UserSearch) {
    const title: string = this.title
    return {
      title,
    }
  },
  async asyncData({ app: { $interactors }, query }) {
    const keyword = query.q.toString()
    const { listInfo, title } = await $interactors.search.run({
      type: 'user',
      params: { q: keyword },
    })
    return {
      listInfo,
      title,
      keyword,
    }
  },
})
export default class UserSearch extends Mixins(Search) {
  readonly listInfo!: ListInfo<User>
}
</script>
