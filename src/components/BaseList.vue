<template>
  <ul
    v-if="items.length"
    v-on-click-outside="updateActiveElement"
    v-infinite-scroll="fetchMore"
    :class="listClass"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100"
  >
    <component
      :is="listElement"
      v-for="(item, index) in items"
      :key="item[idField]"
      :class="
        typeof listItemClass === 'function'
          ? listItemClass(item)
          : listItemClass
      "
      v-bind="listItemProps(item)"
      class="item"
      tabindex="-1"
      @click="setSelect(index)"
    >
      <slot
        :item="item"
        :index="index"
        :selected="isSelected(index)"
        :last-update="lastUpdate"
        :update-item="updateItem"
      />
    </component>
    <li
      v-show="more"
      :class="{ 'list-group-item': listClass !== 'list-unstyled' }"
    >
      <div class="text-center w-100 text-muted my-2">
        <font-awesome-icon spin fixed-width size="2x" icon="sync" />
      </div>
    </li>
  </ul>
  <div v-else class="text-center my-3">
    <slot name="empty">
      <div class="list-group-item py-4">
        No Items
      </div>
    </slot>
  </div>
</template>
<script lang="ts">
import { Prop, Watch, Component, Mixins } from 'vue-property-decorator'
import { User } from '../models/user'
import { PnutResponse } from '~/models/pnut-response'
import keyBinding from '~/assets/ts/key-binding'

const INTERVAL = 1000 * 30 // 30sec

const keyMap = {
  j: 'scrollDown',
  k: 'scrollUp',
  '.': 'refresh',
}

@Component({})
export default class BaseList extends Mixins(keyBinding(keyMap)) {
  @Prop({
    type: Function,
    default: () => () => null,
  })
  dataAddedHook!: (data: any[]) => void

  @Prop({
    type: String,
    default: 'list-group mb-4',
  })
  listClass!: string

  @Prop({
    type: [String, Function],
    default: 'list-group-item list-group-item-action',
  })
  listItemClass!: string | ((data: any) => void)

  @Prop({
    type: [String, Object, Function],
    default: 'li',
  })
  listElement!: string

  @Prop({
    type: Function,
    default: () => ({}),
  })
  listItemProps!: (data: any) => void

  @Prop({
    type: Boolean,
    default: false,
  })
  disableAutoRefresh!: boolean

  @Prop({
    type: Object,
    validator: (obj) => 'meta' in obj && 'data' in obj,
    required: true,
    default: () => ({
      meta: {},
      data: [],
    }),
  })
  data!: PnutResponse<any[]>

  @Prop({
    type: String,
    default: '',
  })
  resource!: string

  @Prop({
    type: Object,
    default: () => ({}),
  })
  option!: () => object

  @Prop({
    type: String,
    default: 'id',
  })
  idField!: string

  @Prop({
    type: Number,
    default: Date.now(),
  })
  refreshDate!: number

  busy = false
  internalSelect = -1
  items = this.data.data || []
  lastUpdate = Date.now()
  meta = this.data.meta
  refreshing = false
  activeElement = (null as any) as Element | null

  get user(): User | null {
    return this.$accessor.user
  }

  get select(): number {
    return this.internalSelect
  }

  set select(v: number) {
    if (!(this.items.length - 1 < v) && !(v < 0)) {
      this.internalSelect = v
      this.$emit('select', this.internalSelect)
    }
  }

  get moreDisabled(): boolean {
    return this.busy || !this.more
  }

  get more(): boolean {
    return !!this.meta.more
  }

  @Watch('refreshDate')
  onChangeRefreshDate(
    newVal: BaseList['refreshDate'],
    oldVal: BaseList['refreshDate']
  ) {
    if (!newVal || newVal <= oldVal) return
    this.refresh()
  }

  @Watch('data', { deep: true })
  onChangeData(data: BaseList['data']) {
    this.items = 'data' in data ? data.data : []
  }

  mounted() {
    if (this.disableAutoRefresh) return
    const timer = setInterval(this.refresh, INTERVAL)
    this.$once('hook:beforeDestroy', () => clearInterval(timer))
  }

  updateItem(index: number, item: any) {
    this.$set(this.items, index, item)
  }

  updateActiveElement() {
    this.activeElement = document.activeElement
  }

  isSelected(index: number) {
    if (!this.$el || !this.$el.children[this.select]) return
    return (
      index === this.select &&
      this.$el.children[this.select].contains(this.activeElement)
    )
  }

  focus(e?: Event) {
    const element = e ? e.target : this.$el.children[this.select]
    if (!element || !(element instanceof HTMLElement)) return
    this.activeElement = this.$el.children[this.select]
    const { top, bottom, height } = element.getBoundingClientRect()
    if (top < 100) {
      document.documentElement.scrollTop -= 100 - top
    } else if (window.innerHeight < bottom + height) {
      document.documentElement.scrollTop += height
    }
    element.focus()
  }

  setSelect(index: number) {
    this.select = index
    if (this.select < 0) return
    this.activeElement = this.$el.children[this.select]
  }

  scrollDown() {
    this.select++
    if (this.select < 0) return
    this.focus()
  }

  scrollUp() {
    this.select--
    this.focus()
  }

  async fetchMore() {
    if (this.busy) return
    this.busy = true
    try {
      const options = { ...this.option, before_id: this.meta.min_id }
      const { data: newItems, meta } = await this.$resource<any[]>({
        url: this.resource,
        options,
      })
      this.meta = meta

      if (newItems.length) {
        this.items = this.items.concat(newItems)
        // this.$emit('update:data', {
        //   meta: this.meta,
        //   data: this.items
        // })
      }
    } catch (e) {
      console.error(e)
    }
    this.busy = false
  }

  async refresh() {
    if (this.refreshing) return
    this.refreshing = true
    const options = {
      ...this.option,
      since_id: this.items.length && this.items[0].pagination_id,
    }
    const { data: newItems } = await this.$resource<any[]>({
      url: this.resource,
      options,
    })
    if (newItems.length) {
      this.items = newItems.concat(this.items)
      this.select += newItems.length
      this.dataAddedHook(newItems)
    }
    this.refreshing = false
    this.lastUpdate = Date.now()
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
