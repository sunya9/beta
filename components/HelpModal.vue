<template>
  <base-modal
    id="help-modal"
    title="Keyboard shortcuts"
    suppress-warnings
    size="lg"
    hide-footer
  >
    <div class="row flex-wrap">
      <div class="col-lg-4">
        <h6>Actions</h6>
        <no-ssr>
          <key-sets :key-sets="actions" />
        </no-ssr>
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
  </base-modal>
</template>

<script>
import KeySets from './KeySets'
import BaseModal from '~/components/BaseModal'

export default {
  components: {
    KeySets,
    BaseModal
  },
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
      if (process.server) return
      return this.$route.name.startsWith('messages')
        ? this.$options.messageActions
        : this.$options.streamActions
    }
  }
}
</script>
