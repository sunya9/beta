<template>
  <div
    id="help-modal"
    class="modal fade"
    role="dialog"
    tabindex="-1"
    aria-hidden="true">
    <div
      class="modal-dialog modal-lg"
      role="document">
      <div class="modal-content" >
        <div class="modal-header">
          <h5 class="modal-title">
            Keyboard shortcuts
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row flex-wrap">
            <div class="col-lg-4">
              <h6>Actions</h6>
              <key-sets :key-sets="actions" />
            </div>
            <div class="col-lg-4">
              <h6>Navigation</h6>
              <key-sets :key-sets="$options.navigation" />
            </div>
            <div class="col-lg-4">
              <h6>Streams</h6>
              <key-sets :key-sets="$options.streams" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Mousetrap from 'mousetrap'
import bus from '~/assets/js/bus'
import KeySets from './KeySets'
import { underMessages } from '~/assets/js/util'

export default {
  components: {
    KeySets
  },
  mixins: [underMessages],
  streamActions: [
    { key: 'n', label: 'New post' },
    { key: 's', label: 'Start' },
    { key: 'r', label: 'Reply' },
    { key: 'Shift+r', label: 'Reply All' },
    { key: 'p', label: 'Repost' },
    { key: 'Del', label: 'Delete my post' },
    { key: 'Enter', label: 'Go to detail page' },
    { key: 'Ctrl+Enter', label: 'Send post' }
  ],
  messageActions: [
    { key: 'm', label: 'Create a private message' },
    { key: 'c', label: 'Create a chat room' },
    { key: 'n', label: 'New message' },
    { key: 'Del', label: 'Delete a message' },
    { key: 'Enter', label: 'Go to chat page' },
    { key: 'Ctrl+Enter', label: 'Send post' }
  ],
  navigation: [
    { key: 'j', label: 'Next item' },
    { key: 'k', label: 'Previous item' },
    { key: '.', label: 'Load new items' },
    { key: 'Shift+/', label: 'This help' }
  ],
  streams: [
    { key: ['g', 'h'], label: 'Home' },
    { key: ['g', 'm'], label: 'Mentions' },
    { key: ['g', 'i'], label: 'Interactions' },
    { key: ['g', 's'], label: 'Stars' },
    { key: ['g', 'c'], label: 'Conversations' },
    { key: ['g', 'p'], label: 'Photos' },
    { key: ['g', 't'], label: 'Trending' },
    { key: ['g', 'g'], label: 'Global' }
  ],
  computed: {
    actions() {
      return this.underMessages
        ? this.$options.messageActions
        : this.$options.streamActions
    }
  },
  mounted() {
    $(this.$el).on('hidden.bs.modal', this.hidden)
    bus.$on('showHelpModal', this.showModal)
  },
  beforeDestroy() {
    bus.$off('showHelpModal', this.showModal)
  },
  methods: {
    showModal() {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
      }
    },
    hidden() {
      Mousetrap.unpause()
    }
  }
}
</script>
<style scoped>
</style>
