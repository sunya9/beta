<template>
  <div>
    <post-list
      :key="`post-${id}`"
      :main="id"
      :list-info="listInfo"
      :refresh-date="date"
      disable-auto-refresh
      all
      reverse
    />
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ListInfo } from '~/plugins/domain/util/util'
import PostList from '~/components/PostList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { Post } from '~/models/post'

@Component({
  components: {
    PostList,
  },
  async asyncData(ctx) {
    const {
      params: { id },
      app: { $interactors },
    } = ctx
    try {
      const { listInfo, title, meta } = await $interactors.getThread.run({
        postId: id,
        params: {
          include_directed_posts: true,
          include_bookmarked_by: true,
          include_reposted_by: true,
          include_deleted: true,
        },
      })
      return {
        id,
        title,
        meta,
        listInfo,
      }
    } catch (e) {}
  },
  validate({ params }) {
    return /^\w+$/.test(params.name) && /\d+$/.test(params.id)
  },
  head(this: PostView) {
    return {
      title: this.title,
      meta: this.meta,
    }
  },
})
export default class PostView extends Mixins(refreshAfterAdded) {
  readonly listInfo!: ListInfo<Post>
  readonly title!: string
  readonly meta!: any[]
  readonly id!: string
  async mounted() {
    await this.$nextTick()
    this.scrollToMainPost()
  }

  scrollToMainPost() {
    const el = document.querySelector(`#post-${this.$route.params.id}`)
    if (!el) return
    window.scrollTo(
      0,
      window.pageYOffset + el.getBoundingClientRect().top - 200
    )
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.post {
  @include no-gutter-xs;
}
</style>
