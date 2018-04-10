<template>
  <ul v-infinite-scroll="fetchMore" infinite-scroll-disabled="moreDisabled" infinite-scroll-distance="100" ref="list"
    :class="{
       'list-group mb-4': type !== 'Message',
       'list-unstyled': type === 'Message'
    }">
    <component
      :is="type"
      :key="id(item)"
      v-for="(item, index) in  items"
      v-if="showItem(item)"
      :data="item"
      @update:data="data => $set(items, index, data)"
      class="item"
      @click="select = index"
      :class="[{
        'my-4': id(item) === main,
        'list-group-item-warning': isTarget(item)
      }, type.toLowerCase()]"
      :detail="id(item) === main"
      @remove="items.splice(index, 1)"
      :last-update="lastUpdate"
    />
    <slot />
    <li :class="{ 'list-group-item': type !== 'Message' }" v-show="more">
      <div class="text-center w-100 text-muted my-2">
        <i class="fa fa-spin fa-refresh fa-fw fa-2x"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import Mousetrap from '~/plugins/mousetrap'
import User from '~/components/User'
import Post from '~/components/Post'
import Interaction from '~/components/Interaction'
import Message from '~/components/Message'
import Poll from '~/components/Poll'

import {
  sendPostNotification,
  sendMentionNotification
} from '~/assets/js/notification-wrapper'

const INTERVAL = 1000 * 10 // 30sec

export default {
  props: {
    data: Object,
    type: {
      required: true,
      type: String,
      validator(str) {
        return ['User', 'Post', 'Interaction', 'Message', 'Poll'].includes(str)
      }
    },
    all: Boolean,
    option: Object,
    main: String,
    autoRefresh: {
      type: Boolean,
      default: true
    }
  },
  components: {
    User,
    Post,
    Interaction,
    Message,
    Poll
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
      Mousetrap.unbind('del')
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    showItem(item) {
      return (
        this.type !== 'Post' ||
        (this.type === 'Post' && !this.all && !item.is_deleted)
      )
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
        since_id: this.id(this.items[0])
      })
      const { data: newItems } = await this.$resource(option)
      if (newItems.length) {
        this.items = newItems.concat(this.items)
        this.select += newItems.length
        if (this.type === 'Post') {
          const posts = newItems.filter(
            post => this.$store.state.user.id !== post.user.id
          )
          if (posts.length > 0) {
            sendPostNotification(posts)
          }
          const mentions = newItems.filter(post => {
            const notMe = this.$store.state.user.id !== post.user.id
            const includedInMention =
              post.content.entities &&
              post.content.entities.mentions.some(
                mention => mention.id === this.$store.state.user.id
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
      const { data: newItems, meta } = await this.$resource(option)
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
