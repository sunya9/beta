<template>
  <base-list
    ref="list"
    v-bind="$attrs"
    :data.sync="data"
    :data-added-hook="added"
    :list-item-class="
      item => [
        'list-group-item list-group-item-action',
        {
          'my-4': item.id === main,
          'list-group-item-warning': isTarget(item)
        }
      ]
    "
    tabindex="-1"
    @select="select = $event"
  >
    <post
      :key="item.id"
      slot-scope="{ item, index, lastUpdate, selected, updateItem }"
      :selected="selected"
      :post="item"
      :last-update="lastUpdate"
      :detail="item.id === main"
      @update:post="updateItem(index, $event)"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Post from '~/components/Post'
import {
  sendPostNotification,
  sendMentionNotification
} from '~/assets/js/notification-wrapper'
import { mapGetters } from 'vuex'
import keyBinding, { forList } from '~/assets/js/key-binding'

export default {
  keyMaps: {
    r: 'replyModal',
    s: 'favoriteToggle',
    p: 'repostToggle',
    enter: 'goPost',
    del: 'removeModal'
  },
  components: {
    BaseList,
    Post
  },
  mixins: [keyBinding, forList],
  props: {
    main: {
      type: String,
      default: ''
    },
    all: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({
        meta: {},
        data: []
      })
    }
  },
  computed: {
    ...mapGetters(['user']),
    mainItem() {
      return this.data.data.find(item => item.id === this.main)
    }
  },
  methods: {
    isTarget(item) {
      return this.mainItem && this.mainItem.reply_to === item.id
    },
    added(newItems) {
      const posts = newItems.filter(
        post => this.user && this.user.id !== post.user.id
      )
      if (posts.length > 0) sendPostNotification(posts)
      const mentions = newItems.filter(post => {
        const notMe = this.user && this.user.id !== post.user.id
        const includedInMention =
          post.content.entities &&
          post.content.entities.mentions.some(
            mention => this.user && mention.id === this.user.id
          )
        return notMe && includedInMention
      })
      if (mentions.length > 0) sendMentionNotification(mentions)
    }
  }
}
</script>
