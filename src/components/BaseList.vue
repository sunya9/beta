<template>
  <component
    :is="tag"
    v-if="items.length"
    v-on-click-outside="updateActiveElement"
    v-infinite-scroll="fetchMore"
    :class="[listClass, { reverse }]"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="1000"
  >
    <template v-for="(item, index) in items">
      <slot
        tabindex="-1"
        :item="item"
        :index="index"
        :selected="isSelected(index)"
        :last-update="lastUpdate"
        :update-item="updateItem"
        @click="setSelect(index)"
      />
    </template>
    <component
      :is="listElement"
      v-show="more"
      :class="{ 'list-group-item': listClass !== 'list-unstyled' }"
    >
      <div class="text-center w-100 text-muted my-2">
        <font-awesome-icon spin fixed-width size="2x" icon="sync" />
      </div>
    </component>
  </component>
  <component :is="tag" v-else class="text-center my-3">
    <slot name="empty">
      <component :is="listElement" class="list-group-item py-4">
        No Items
      </component>
    </slot>
  </component>
</template>
<script lang="ts">
import { Prop, Watch, Component, Mixins } from 'vue-property-decorator'
import keyBinding from '~/assets/ts/key-binding'
import { ListInfo } from '~/plugins/domain/util/util'

const INTERVAL = 1000 * 30 // 30sec

const keyMap = {
  j: 'scrollDown',
  k: 'scrollUp',
  '.': 'refresh',
}

export interface GetMoreProps {
  sinceId?: string
  beforeId?: string
}

@Component({})
export default class BaseList<T extends object = object> extends Mixins(
  keyBinding(keyMap)
) {
  @Prop({
    type: Function,
    default: () => () => null,
  })
  dataAddedHook!: (data: T[]) => void

  @Prop({
    type: String,
    default: 'list-group mb-4',
  })
  listClass!: string

  @Prop({
    type: [String, Object, Function],
    default: 'li',
  })
  listElement!: string

  @Prop({
    type: Boolean,
    default: false,
  })
  disableAutoRefresh!: boolean

  @Prop({
    type: Number,
    default: Date.now(),
  })
  refreshDate!: number

  @Prop({
    type: Object,
    required: true,
  })
  listInfo!: ListInfo<T>

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  reverse!: boolean

  @Prop({
    type: String,
    required: false,
    default: 'ul',
  })
  tag!: string

  get getOlder() {
    return this.listInfo.getOlder
  }

  get getNewer() {
    return this.listInfo.getNewer
  }

  get olderMeta() {
    return this.listInfo.olderMeta
  }

  busy = false
  internalSelect = -1
  activeElement: Element | null = null

  get items(): T[] {
    return this.listInfo.data
  }

  lastUpdate = Date.now()

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
    return !!this.olderMeta.more
  }

  @Watch('refreshDate')
  onChangeRefreshDate(
    newVal: BaseList['refreshDate'],
    oldVal: BaseList['refreshDate']
  ) {
    if (!newVal || newVal <= oldVal) return
    this.refresh()
  }

  mounted() {
    if (this.disableAutoRefresh) return
    const timer = setInterval(this.refresh, INTERVAL)
    this.$once('hook:beforeDestroy', () => clearInterval(timer))
  }

  updateItem(index: number, item: T) {
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

  scrollDown(ignoreReverse?: boolean): void {
    if (this.reverse && !ignoreReverse) return this.scrollUp(true)
    this.select++
    if (this.select < 0) return
    this.focus()
  }

  scrollUp(ignoreReverse?: boolean): void {
    if (this.reverse && !ignoreReverse) return this.scrollDown(true)
    if (this.reverse && this.select < 0) {
      this.select = this.listInfo.data.length - 1
    } else {
      this.select--
    }
    this.focus()
  }

  async fetchMore() {
    if (this.busy) return
    this.busy = true
    try {
      await this.getOlder()
    } catch (e) {
      console.error(e)
    } finally {
      this.busy = false
    }
  }

  async refresh() {
    if (this.busy) return
    this.busy = true
    try {
      const { size, data } = await this.getNewer()
      this.lastUpdate = Date.now()
      this.select += size
      this.dataAddedHook(data)
    } catch (e) {
      console.error(e)
    } finally {
      this.busy = false
    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.list-group {
  @include no-gutter-xs;
  display: flex;
  flex-direction: column;
  &.reverse {
    flex-direction: column-reverse;
    .item:not(.message) {
      &:only-child,
      &:first-child {
        margin-top: 0 !important;
      }
      &:first-child:not(:only-child) {
        border-top: 0;
      }
    }
  }
}

// workaround for zooming
.list-group /deep/ .list-group-item:hover {
  z-index: auto;
}

.item:not(.message) {
  &:only-child,
  &:first-child {
    /* margin-top: 0 !important; */
  }
}
</style>
