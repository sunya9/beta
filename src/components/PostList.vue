<template>
  <base-list
    v-slot="{ item, index, lastUpdate, selected, updateItem }"
    v-bind="$attrs"
    :list-info="listInfo"
    :data-added-hook="added"
    :list-item-class="
      (item) => [
        'list-group-item list-group-item-action',
        {
          'my-4': item.id === main,
          'list-group-item-warning': isTarget(item),
        },
      ]
    "
    tabindex="-1"
    v-on="$listeners"
  >
    <post
      :key="item.id"
      :selected="selected"
      :post="item"
      :last-update="lastUpdate"
      :detail="item.id === main"
      @update:post="updateItem(index, $event)"
    />
  </base-list>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { User } from '~/models/user'
import BaseList from '~/components/BaseList.vue'
import PostView from '~/components/Post.vue'
import {
  sendPostNotification,
  sendMentionNotification,
} from '~/assets/ts/notification-wrapper'
import keyBinding, { forList } from '~/assets/ts/key-binding'
import { Post } from '~/models/post'
import { ListInfo } from '~/plugins/domain/util/util'

const keyMap = {
  r: 'replyModal',
  s: 'favoriteToggle',
  p: 'repostToggle',
  enter: 'goPost',
  del: 'removeModal',
}

@Component({
  inheritAttrs: false,
  components: {
    BaseList,
    Post: PostView,
  },
  mixins: [keyBinding(keyMap), forList(keyMap)],
})
export default class PostList extends Vue {
  @Prop({ type: String, default: '' })
  main!: string

  @Prop({ type: Object, required: true })
  listInfo!: ListInfo<Post>

  get user(): User | null {
    return this.$accessor.user
  }

  get mainItem(): Post | null {
    return (
      this.listInfo.data.find((item: Post) => item.id === this.main) || null
    )
  }

  isTarget(item: Post): boolean {
    return this.mainItem?.reply_to === item.id
  }

  added(newItems: Post[]): boolean | void {
    const posts = newItems.filter((post) => this.user?.id !== post.user?.id)
    if (posts.length > 0) sendPostNotification(posts)
    const mentions = newItems.filter((post) => {
      const notMe = this.user?.id !== post.user?.id
      const includedInMention = post.content?.entities.mentions.some(
        (mention) => mention.id === this.user?.id
      )
      return notMe && includedInMention
    })
    if (mentions.length > 0) sendMentionNotification(mentions)
  }
}
</script>
