<template>
  <div class="card no-gutter-xs">
    <div class="card-body">
      <ul
        class="list-unstyled"
        v-infinite-scroll="fetchMore"
        infinite-scroll-disabled="moreDisabled"
        infinite-scroll-distance="100"
        >
        <message
          v-for="message in messages"
          :key="message.id"
          :message="message" />
        <li v-show="meta.more">
          <div class="text-center w-100 text-muted my-2">
            <i class="fa fa-spin fa-refresh fa-fw fa-2x"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Message from '~/components/Message'
import api from '~/plugins/api'

export default {
  props: {
    messages: {
      type: Array
    },
    meta: {
      type: Object
    }
  },
  data() {
    return {
      busy: false
    }
  },
  computed: {
    moreDisabled() {
      return this.busy || !this.meta.more
    }
  },
  methods: {
    async fetchMore() {
      this.busy = true
      const option = Object.assign({}, this.defaultOption, {
        before_id: this.meta.min_id
      })
      const { data: newItems, meta } = await api({
        route: this.$route
      }).fetch(option)

      if (newItems.length) {
        const messages = this.messages.concat(newItems)
        this.$emit('update:messages', messages)
        this.$emit('update:meta', meta)
      }
      this.busy = false
    }
  },
  components: {
    Message
  }
}
</script>
