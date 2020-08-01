<template>
  <div>
    <post-list
      :key="`post-${listInfo.data[0].id}`"
      :list-info="listInfo"
      disable-auto-refresh
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PostList from '~/components/organisms/PostList.vue'
import { Post } from '~/models/post'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    PostList,
  },
  async asyncData({ app: { $interactors }, params: { id } }) {
    const { listInfo, title, meta } = await $interactors.getRevision.run({
      postId: id,
    })
    return {
      listInfo,
      title,
      meta,
    }
  },

  head(this: Revisions) {
    return {
      title: this.title,
      meta: this.meta,
    }
  },
  validate({ params }) {
    return /^\w+$/.test(params.name) && /\d+$/.test(params.id)
  },
})
export default class Revisions extends Vue {
  readonly listInfo!: ListInfo<Post>
  readonly meta!: any[]
  readonly title!: string
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.post {
  @include no-gutter-xs;
}
</style>
