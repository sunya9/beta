<template>
  <base-modal
    id="message-modal"
    title="Create a room"
    suppress-warnings
    hide-footer
    @shown="shown"
    @show="show"
    @hidden="hidden"
  >
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a
          id="create-private-room-tab-label"
          data-toggle="tab"
          role="tab"
          aria-controls="create-private-room-tab"
          aria-selected="true"
          href="#create-private-room-tab"
          class="nav-link active"
        >
          private
        </a>
      </li>
      <li class="nav-item">
        <a
          id="create-public-room-tab-label"
          data-toggle="tab"
          role="tab"
          aria-controls="create-public-room-tab"
          aria-selected="false"
          href="#create-public-room-tab"
          class="nav-link"
        >
          public
        </a>
      </li>
    </ul>

    <div class="tab-content">
      <div
        id="create-private-room-tab"
        class="tab-pane active"
        role="tabpanel"
        aria-labelledby="create-private-room-tab-label"
      >
        <message-compose
          ref="messageCompose"
          class="border-0 mb-0-only-child"
          create-channel-mode
          @submit="hideRequest"
          @foundChannel="hideRequest"
        />
      </div>
      <div
        id="create-public-room-tab"
        class="tab-pane"
        role="tabpanel"
        aria-labelledby="create-public-room-tab-label"
      >
        <channel-compose
          ref="channelCompose"
          class="border-0 mb-0-only-child"
          @submit="hideRequest"
        />
      </div>
    </div>
  </base-modal>
</template>

<script lang="ts">
import BSN from 'bootstrap.native'
import { Vue, Component } from 'nuxt-property-decorator'
import MessageCompose from '~/components/organisms/MessageCompose.vue'
import ChannelCompose from '~/components/ChannelCompose.vue'
import BaseModal from '~/components/BaseModal.vue'

interface TabMap {
  [key: string]: BSN.Tab
}

@Component({
  components: {
    BaseModal,
    MessageCompose,
    ChannelCompose,
  },
})
export default class extends Vue {
  tabMap: TabMap = {}
  isPrivate = false
  // TODO
  $refs!: {
    channelCompose: any
    messageCompose: any
    modal: any
  }

  get id() {
    return `create-${this.isPrivate ? 'private' : 'public'}-room-tab`
  }

  mounted() {
    const targets = this.$el.querySelectorAll('[data-toggle="tab"]')
    this.tabMap = Array.from(targets).reduce<TabMap>((obj, target) => {
      const anchor = target as HTMLAnchorElement
      obj[anchor.hash.slice(1)] = new BSN.Tab(target)
      target.addEventListener('shown.bs.tab', this.shown, false)
      this.$once('hook:beforeDestroy', () =>
        target.removeEventListener('shown.bs.tab', this.shown)
      )
      return obj
    }, {})
  }

  shown() {
    const pane = this.$el.querySelector('.tab-pane.active')
    if (!pane) return
    const input = pane.querySelector<HTMLInputElement>('textarea, input')
    if (!input) return
    input.focus()
  }

  show({ isPrivate = true }) {
    this.isPrivate = isPrivate
    // already shown
    if (this.$el.querySelector(`#${this.id}.active`)) return
    this.tabMap[this.id].show()
  }

  hidden() {
    this.$refs.channelCompose.reset()
    this.$refs.messageCompose.reset()
  }

  hideRequest() {
    if (!this.$refs.modal) return
    this.$refs.modal.ok()
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.nav-link.active {
  background: $modal-content-bg;
  border-bottom-color: $modal-content-bg;
}
</style>
