<template>
  <base-list
    v-slot="{ item, index, lastUpdate, selected, updateItem }"
    v-bind="$attrs"
    :list-info="listInfo"
    :data-added-hook="added"
    tabindex="-1"
    v-on="$listeners"
    @select="select = $event"
  >
    <li
      tabindex="-1"
      :class="[
        'list-group-item list-group-item-action',
        {
          'mt-4': item.id === main && index !== listInfo.data.length - 1,
          'mb-4': item.id === main,
          'list-group-item-warning': isTarget(item),
        },
      ]"
    >
      <post
        :key="item.id"
        :selected="selected"
        :post="item"
        :last-update="lastUpdate"
        :detail="item.id === main"
        @update:post="updateItem(index, $event)"
      />
    </li>
  </base-list>
</template>
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import { Mixins } from 'vue-property-decorator'
import { User } from '~/entity/user'
import BaseList from '~/components/molecules/BaseList.vue'
import PostView from '~/components/organisms/Post.vue'
import {
  sendPostNotification,
  sendMentionNotification,
} from '~/assets/ts/notification-wrapper'
import keyBinding, { forList } from '~/assets/ts/key-binding'
import { Post } from '~/entity/post'
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
})
export default class PostList extends Mixins(
  keyBinding(keyMap),
  forList(keyMap)
) {
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
