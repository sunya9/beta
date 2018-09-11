<template>
  <ul
    v-infinite-scroll="fetchMore"
    v-if="items.length"
    ref="list"
    :class="{
      'list-group mb-4': type !== 'Message',
      'list-unstyled': type === 'Message'
    }"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100">
    <component
      v-for="(item, index) in items"
      v-if="showItem(item)"
      :is="type"
      :key="id(item)"
      :data="item"
      :is-moderator="isModerator"
      :channel-type="channelType"
      :last-read-message-id="lastReadMessageId"
      :class="[{
        'my-4': id(item) === main,
        'list-group-item-warning': isTarget(item),
        'list-group-item list-group-item-action': type === 'Channel',
      }, type.toLowerCase()]"
      :detail="id(item) === main"
      v-bind="componentOptions"
      :last-update="lastUpdate"
      class="item"
      @update:data="data => $set(items, index, data)"
      @click="select = index"
      @remove="items.splice(index, 1)" />
    <slot />
    <li
      v-show="more"
      :class="{ 'list-group-item': type !== 'Message' }">
      <div class="text-center w-100 text-muted my-2">
        <font-awesome-icon
          spin
          fixed-width
          size="2x"
          icon="sync"
        />
      </div>
    </li>
  </ul>
  <div v-else>
    <div class="text-center my-3">
      <slot name="empty">
        <div class="list-group-item py-4">
          No {{ type.toLowerCase() }}s
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Mousetrap from '~/plugins/mousetrap'
import User from '~/components/User'
import Post from '~/components/Post'
import Interaction from '~/components/Interaction'
import Message from '~/components/Message'
import Poll from '~/components/Poll'
import Channel from '~/components/Channel'
import { mapGetters } from 'vuex'

import {
  sendPostNotification,
  sendMentionNotification
} from '~/assets/js/notification-wrapper'

const INTERVAL = 1000 * 30 // 30sec

export default {
  components: {
    User,
    Post,
    Interaction,
    Message,
    Channel,
    Poll
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      required: true,
      type: String,
      validator(str) {
        return [
          'User',
          'Post',
          'Interaction',
          'Message',
          'Poll',
          'Channel'
        ].includes(str)
      }
    },
    all: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default: () => ({})
    },
    main: {
      type: String,
      default: ''
    },
    autoRefresh: {
      type: Boolean,
      default: true
    },
    componentOptions: {
      type: Object,
      default: () => ({})
    },
    isModerator: {
      type: Boolean,
      default: false
    },
    channelType: {
      type: String,
      default: ''
    },
    lastReadMessageId: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      busy: false,
      meta: this.data.meta,
      items: this.data.data || [],
      internalSelect: -1,
      timer: null,
      refreshing: false,
      lastUpdate: Date.now()
    }
  },
  computed: {
    ...mapGetters(['user']),
    mainItem() {
      return (
        this.type === 'Post' &&
        this.items.filter(item => item.id === this.main)[0]
      )
    },
    more() {
      return this.meta.more
    },
    moreDisabled() {
      return this.busy || !this.more
    },
    select: {
      get() {
        return this.internalSelect
      },
      set(v) {
        if (!(this.items.length - 1 < v) && !(v < 0)) {
          this.internalSelect = v
        }
      }
    },
    selectItem() {
      if (this.select < 0) return null
      return this.$refs.list.children[this.select].__vue__
    },
    defaultOption() {
      const option = {}
      switch (this.type) {
        case 'Post': {
          option.include_deleted = false
        }
      }
      return Object.assign({}, this.option, option)
    },
    isAutoRefresh() {
      return this.autoRefresh && this.type === 'Post'
    }
  },
  mounted() {
    Mousetrap.bind('j', this.scrollDown)
    Mousetrap.bind('k', this.scrollUp)
    Mousetrap.bind('.', this.refresh)
    if (this.type === 'Post') {
      Mousetrap.bind('r', this.reply)
      Mousetrap.bind('shift+r', this.replyAll)
      Mousetrap.bind('s', this.favorite)
      Mousetrap.bind('p', this.repost)
      Mousetrap.bind('enter', this.goPost)
    }
    if (['Post', 'Message'].includes(this.type)) {
      Mousetrap.bind('del', this.remove)
    }
    if (this.isAutoRefresh) {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(this.refresh, INTERVAL)
    }
  },
  beforeDestroy() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('.')
    if (this.type === 'Post') {
      Mousetrap.unbind('s')
      Mousetrap.unbind('r')
      Mousetrap.unbind('p')
      Mousetrap.unbind('enter')
    }
    if (['Post', 'Message'].includes(this.type)) {
      Mousetrap.unbind('del')
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    showItem(item) {
      return this.type !== 'Post' || this.all || !item.is_deleted
    },
    isTarget(item) {
      return this.mainItem ? this.mainItem.reply_to === item.id : null
    },
    focus() {
      if (this.selectItem && this.selectItem.$el) {
        this.selectItem.$el.focus()
      }
    },
    scrollDown() {
      this.select++
      this.focus()
    },
    scrollUp() {
      this.select--
      this.focus()
    },
    reply() {
      if (this.selectItem) {
        this.selectItem.replyModal()
      }
    },
    replyAll() {
      if (this.selectItem) {
        this.selectItem.replyAllModal()
      }
    },
    remove() {
      if (!this.selectItem || !this.selectItem.me) return
      this.selectItem.removeModal()
    },
    favorite() {
      if (this.selectItem) {
        this.selectItem.favoriteToggle()
      }
    },
    repost() {
      if (this.selectItem) {
        this.selectItem.repostToggle()
      }
    },
    goPost() {
      if (this.selectItem) {
        this.$router.push(this.selectItem.permalink)
      }
    },
    id(item) {
      if (this.type === 'Interaction') {
        return item.pagination_id
      } else {
        return item.id
      }
    },
    async refresh() {
      if (this.refreshing) return
      this.refreshing = true
      const option = Object.assign({}, this.defaultOption, {
        since_id: this.items.length && this.id(this.items[0])
      })
      const { data: newItems } = await this.$resource(this.resource, option)
      if (newItems.length) {
        this.items = newItems.concat(this.items)
        this.select += newItems.length
        if (this.type === 'Post') {
          const posts = newItems.filter(post => this.user.id !== post.user.id)
          if (posts.length > 0) {
            sendPostNotification(posts)
          }
          const mentions = newItems.filter(post => {
            const notMe = this.user.id !== post.user.id
            const includedInMention =
              post.content.entities &&
              post.content.entities.mentions.some(
                mention => mention.id === this.user.id
              )
            return notMe && includedInMention
          })
          if (mentions.length > 0) {
            sendMentionNotification(mentions)
          }
        }
      }
      this.refreshing = false
      this.lastUpdate = Date.now()
    },
    async fetchMore() {
      this.busy = true
      const option = Object.assign({}, this.defaultOption, {
        before_id: this.meta.min_id
      })
      const { data: newItems, meta } = await this.$resource(
        this.resource,
        option
      )
      this.meta = meta

      if (newItems.length) {
        this.items = this.items.concat(newItems)
      }
      this.busy = false
    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.list-group {
  @include no-gutter-xs;
}

// workaround for zooming
.list-group /deep/ .list-group-item:hover {
  z-index: auto;
}

.item:not(.message) {
  &:only-child,
  &:first-child {
    margin-top: 0 !important;
  }
}
</style>
