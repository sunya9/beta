<template>
  <ul
    v-infinite-scroll="fetchMore"
    v-if="items.length"
    ref="list"
    :class="listClass"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100"
  >
    <component
      v-for="(item, index) in items"
      :key="item[idField]"
      :class="listItemClass"
      :is="listElement"
      v-bind="listItemProps(item)"
      class="item"
      tabindex="-1"
      @click="setSelect(index)"
    >
      <slot
        :item="item"
        :index="index"
        :last-update="lastUpdate"
      />
    </component>
    <li
      v-show="more"
      :class="{ 'list-group-item': listClass !== 'list-unstyled' }">
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
  <div
    v-else
    class="text-center my-3"
  >
    <slot name="empty">
      <div
        class="list-group-item py-4"
      >
        No Items
      </div>
    </slot>
  </div>
</template>
<script>
import Mousetrap from '~/plugins/mousetrap'
import { mapGetters } from 'vuex'

const INTERVAL = 1000 * 30 // 30sec

export default {
  props: {
    dataAddedHook: {
      type: Function,
      default: () => () => null
    },
    listClass: {
      type: String,
      default: 'list-group mb-4'
    },
    listItemClass: {
      type: String,
      default: 'list-group-item list-group-item-action'
    },
    listElement: {
      type: [String, Object, Function],
      default: 'li'
    },
    listItemProps: {
      type: Function,
      default: () => ({})
    },
    disableAutoRefresh: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      validator: obj => 'meta' in obj && 'data' in obj,
      required: true
    },
    resource: {
      type: String,
      default: ''
    },
    option: {
      type: Object,
      default: () => ({})
    },
    idField: {
      type: String,
      default: 'id'
    },
    refreshDate: {
      type: Number,
      default: Date.now()
    }
  },
  data() {
    return {
      busy: false,
      internalSelect: -1,
      items: this.data.data || [],
      lastUpdate: Date.now(),
      meta: this.data.meta,
      refreshing: false,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['user']),
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

    moreDisabled() {
      return this.busy || !this.more
    },
    more() {
      return this.meta.more
    }
  },
  watch: {
    refreshDate(newVal, oldVal) {
      if (!newVal || newVal <= oldVal) return
      this.refresh()
    }
  },
  mounted() {
    Mousetrap.bind('j', this.scrollDown)
    Mousetrap.bind('k', this.scrollUp)
    Mousetrap.bind('.', this.refresh)
    if (!this.disableAutoRefresh) {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(this.refresh, INTERVAL)
    }
  },
  beforeDestroy() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('.')
    if (!this.timer) return
    clearInterval(this.timer)
  },
  methods: {
    async focus(e) {
      const element = e ? e.target : this.$el.children[this.select]
      if (!element) return
      const { top, bottom, height } = element.getBoundingClientRect()
      if (top < 100) {
        document.documentElement.scrollTop -= 100 - top
      } else if (window.innerHeight < bottom + height) {
        document.documentElement.scrollTop += height
      }
      element.focus()
    },
    setSelect(index) {
      this.select = index
    },
    scrollDown() {
      this.select++
      if (this.select < 0) return
      this.focus()
    },
    scrollUp() {
      this.select--
      this.focus()
    },
    async fetchMore() {
      if (this.busy) return
      this.busy = true
      try {
        const option = { ...this.option, before_id: this.meta.min_id }
        const { data: newItems, meta } = await this.$resource(
          this.resource,
          option
        )
        this.meta = meta

        if (newItems.length) {
          this.items = this.items.concat(newItems)
        }
      } catch (e) {
        console.error(e)
      }
      this.busy = false
    },
    async refresh() {
      if (this.refreshing) return
      this.refreshing = true
      const option = {
        ...this.option,
        since_id: this.items.length && this.items[0][this.idField]
      }
      const { data: newItems } = await this.$resource(this.resource, option)
      if (newItems.length) {
        this.items = newItems.concat(this.items)
        this.select += newItems.length
        this.dataAddedHook(newItems)
      }
      this.refreshing = false
      this.lastUpdate = Date.now()
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
