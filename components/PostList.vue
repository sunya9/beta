<template>
  <base-list
    v-bind="$attrs"
    :option="{
      include_deleted: false
    }"
    :data-added-hook="added"
  >
    <post
      v-if="showItem(item)"
      slot-scope="{ item, index, lastUpdate }"
      :key="item.id"
      :post.sync="item"
      :last-update="lastUpdate"
      :class="{
        'my-4': item.id === main,
        'list-group-item-warning': isTarget(item)
      }"
      :detail="item.id === main"
      @update:post="$set($attrs.data.data, index, $event)"

    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Post from '~/components/Post'
import Mousetrap from '~/plugins/mousetrap'
import {
  sendPostNotification,
  sendMentionNotification
} from '~/assets/js/notification-wrapper'
import { mapGetters } from 'vuex'

export default {
  components: {
    BaseList,
    Post
  },
  props: {
    all: {
      type: Boolean,
      default: false
    },
    main: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['user']),
    mainItem() {
      return this.$attrs.data.data.find(item => item.id === this.main)
    }
  },
  mounted() {
    Mousetrap.bind('r', this.reply)
    Mousetrap.bind('shift+r', this.replyAll)
    Mousetrap.bind('s', this.favorite)
    Mousetrap.bind('p', this.repost)
    Mousetrap.bind('enter', this.goPost)
    Mousetrap.bind('del', this.remove)
  },
  beforeDestroy() {
    Mousetrap.unbind('r')
    Mousetrap.unbind('shift+r')
    Mousetrap.unbind('s')
    Mousetrap.unbind('p')
    Mousetrap.unbind('enter')
    Mousetrap.unbind('del')
  },
  methods: {
    remove() {
      if (!this.selectItem || !this.selectItem.me) return
      this.selectItem.removeModal()
    },
    showItem(item) {
      return this.all || !item.is_deleted
    },
    isTarget(item) {
      return this.mainItem && this.mainItem.reply_to === item.id
    },
    reply() {
      if (!this.selectItem) return
      this.selectItem.replyModal()
    },
    replyAll() {
      if (!this.selectItem) return
      this.selectItem.replyAllModal()
    },
    favorite() {
      if (!this.selectItem) return
      this.selectItem.favoriteToggle()
    },
    repost() {
      if (!this.selectItem) return
      this.selectItem.repostToggle()
    },
    goPost() {
      if (!this.selectItem) return
      this.$router.push(this.selectItem.permalink)
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
