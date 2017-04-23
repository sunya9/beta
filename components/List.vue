<template>
  <ul
    v-infinite-scroll="fetchMore"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100"
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

export default {
  props: {
    data: Object,
    type: String,
    all: Boolean,
    option: Object,
    main: String
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
      items: this.data.data,
      internalSelect: -1,
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
      return this.$refs.items[this.select]
    }
  },
  mounted () {
    Mousetrap.bind('j', this.scrollDown)
    Mousetrap.bind('k', this.scrollUp)
    if(this.type === 'Post') {
      Mousetrap.bind('r', this.reply)
      Mousetrap.bind('s', this.favorite)
      Mousetrap.bind('p', this.repost)
      Mousetrap.bind('enter', this.goPost)
    }
  },
  beforeDestroy() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    if(this.type === 'Post') {
      Mousetrap.unbind('s')
      Mousetrap.unbind('r')
      Mousetrap.unbind('p')
      Mousetrap.unbind('enter')
    }
  },
  methods: {
    focus() {
      if(this.selectItem.$el)
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