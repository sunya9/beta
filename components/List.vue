<template>
  <ul
    v-infinite-scroll="fetchMore"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100"
    ref="list"
    class="list-group mb-4">
    <component
      :is="type"
      :key="id(item)"
      v-for="(item, index) in filterItems"
      :data="item"
      class="item"
      ref="items"
      :class="{
        'my-4': id(item) === main
      }"
      :detail="id(item) === main"
      @remove="items.splice(index, 1)"></component>
    <slot></slot>
    <li class="list-group-item" v-show="more">
      <div class="text-center w-100 text-muted my-2">
        <i class="fa fa-spin fa-refresh fa-fw fa-2x"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import mousetrap from 'mousetrap'
import User from '~components/User'
import Post from '~components/Post'
import Interaction from '~components/Interaction'
import api from '~plugins/api'
import router from '~router'

const INTERVAL = 1000 * 60 // 1min

export default {
  props: {
    data: Object,
    type: String,
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
    Interaction
  },
  data() {
    return {
      busy: false,
      meta: this.data.meta,
      items: this.data.data || [],
      internalSelect: -1,
      timer: null,
      refreshing: false
    }
  },
  computed: {
    filterItems() {
      if (this.type === 'Post' && !this.all) {
        return this.items.filter(item => !item.is_deleted)
      }
      return this.items
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
        if(!(this.items.length - 1 < v) && !(0 > v)) {
          this.internalSelect = v
        }
      }
    },
    selectItem() {
      if(this.select < 0) return null
      return this.$refs.list.children[this.select].__vue__
    }
  },
  mounted () {
    Mousetrap.bind('j', this.scrollDown)
    Mousetrap.bind('k', this.scrollUp)
    Mousetrap.bind('.', this.refresh)
    if(this.type === 'Post') {
      Mousetrap.bind('r', this.reply)
      Mousetrap.bind('s', this.favorite)
      Mousetrap.bind('p', this.repost)
      Mousetrap.bind('enter', this.goPost)
      Mousetrap.bind('del', this.remove)
    }
    if(this.autoRefresh) {
      if(this.timer) clearInterval(this.timer)
      this.timer = setInterval(this.refresh, INTERVAL)
    }
  },
  beforeDestroy() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('.')
    if(this.type === 'Post') {
      Mousetrap.unbind('s')
      Mousetrap.unbind('r')
      Mousetrap.unbind('p')
      Mousetrap.unbind('enter')
      Mousetrap.unbind('del')
    }
    if(this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    focus() {
      if(this.selectItem && this.selectItem.$el)
        this.selectItem.$el.focus()
    },
    scrollDown() {
      this.select++
      this.focus()
    },
    scrollUp() {
      this.select--
      this.focus()
    },
    reply () {
      if(this.selectItem)
        this.selectItem.replyModal()
    },
    remove () {
      if(!this.selectItem || !this.selectItem.me) return
      this.selectItem.removeModal()
    },
    favorite () {
      if(this.selectItem)
        this.selectItem.favoriteToggle()
    },
    repost () {
      if(this.selectItem)
        this.selectItem.repostToggle()
    },
    goPost () {
      if(this.selectItem)
        router.push(this.selectItem.permalink)
    },
    id(item) {
      if(this.type === 'Interaction') {
        return item.pagination_id
      } else {
        return item.id
      }
    },
    async refresh() {
      if(this.refreshing) return
      this.refreshing = true
      const option = Object.assign({}, this.option, {
        since_id: this.id(this.items[0])
      })
      const { data: newItems } = await api({
          route: this.$route
        }).fetch(option)
      if(newItems.length) {
        this.items = newItems.concat(this.items)
        this.select += newItems.length
      }
      this.refreshing = false
    },
    async fetchMore() {
      this.busy = true
      const option = Object.assign({}, this.option, {
        before_id: this.meta.min_id
      })
      const { data: newItems, meta } = await api({
          route: this.$route
        }).fetch(option)
      this.meta = meta

      if(newItems.length) {
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
  @include no-gutter-xs
}

.item:only-child, .item:first-child {
  margin-top: 0 !important;
}
</style>