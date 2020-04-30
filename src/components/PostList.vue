<template>
  <base-list
    ref="list"
    v-slot="{ item, index, lastUpdate, selected, updateItem }"
    v-bind="$attrs"
    :data.sync="data"
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
    @select="select = $event"
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
import { PnutResponse } from '~/models/pnut-response'

const keyMap = {
  r: 'replyModal',
  s: 'favoriteToggle',
  p: 'repostToggle',
  enter: 'goPost',
  del: 'removeModal',
}

@Component({
  components: {
    BaseList,
    Post: PostView,
  },
  mixins: [keyBinding(keyMap), forList(keyMap)],
})
export default class PostList extends Vue {
  @Prop({ type: String, default: '' })
  main!: string

  @Prop({ type: Boolean, default: false })
  all!: boolean

  @Prop({ type: Object, required: true })
  data!: PnutResponse<Post[]>

  select!: number
  get user(): User | null {
    return this.$accessor.user
  }

  get mainItem(): Post | null {
    return this.data.data.find((item: Post) => item.id === this.main) || null
  }

  isTarget(item: Post): boolean {
    return !!this.mainItem && this.mainItem.reply_to === item.id
  }

  added(newItems: Post[]): boolean | void {
    const posts = newItems.filter(
      (post) => this.user && post.user && this.user.id !== post.user.id
    )
    if (posts.length > 0) sendPostNotification(posts)
    const mentions = newItems.filter((post) => {
      const notMe = this.user && post.user && this.user.id !== post.user.id
      const includedInMention =
        post.content &&
        post.content.entities &&
        post.content.entities.mentions.some(
          (mention) => this.user && mention.id === this.user.id
        )
      return notMe && includedInMention
    })
    if (mentions.length > 0) sendMentionNotification(mentions)
  }
}
</script>
