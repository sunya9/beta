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

export default {
  props: {
    data: Object,
    type: String,
    all: Boolean,
    option: Object
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
      items: this.data.data
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
    }
  },
  methods: {
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
</style>