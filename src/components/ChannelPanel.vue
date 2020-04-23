<template>
  <div>
    <h1><slot name="title" /></h1>
    <div class="row">
      <div class="col-sm col-md-12">
        <slot />
        <div v-if="user" class="form-group">
          <custom-checkbox
            v-model="channel.you_subscribed"
            :resource="`/channels/${channel.id}/subscribe`"
            @change="cancelMute"
          >
            Subscribed
          </custom-checkbox>
          <custom-checkbox
            v-model="channel.you_muted"
            :resource="`/channels/${channel.id}/mute`"
            @change="cancelSubscribe"
          >
            Muted
          </custom-checkbox>
          <custom-checkbox
            :checked="!channel.has_unread"
            :disabled="!channel.has_unread"
            @change="markAsRead"
          >
            Mark as read
          </custom-checkbox>
        </div>
      </div>
      <div class="col-sm col-md-12">
        <h2 class="h3">
          <slot name="memberTitle">
            Members
          </slot>
        </h2>
        <slot name="memberList" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import markAsRead from '~/assets/ts/mark-as-read'
import CustomCheckbox from '~/components/CustomCheckbox.vue'
import { User } from '~/models/user'
import { Channel } from '~/models/channel'
export default Vue.extend({
  name: 'ChannelPanel',
  components: {
    CustomCheckbox,
  },
  mixins: [markAsRead],
  props: {
    channel: {
      type: Object,
      required: true,
    } as PropOptions<Channel>,
  },
  computed: {
    user(): User | null {
      return this.$accessor.user
    },
  },
  methods: {
    cancelSubscribe(bool: boolean) {
      if (!bool) return
      this.$emit('update:channel', {
        ...this.channel,
        you_subscribed: false,
      })
    },
    cancelMute(bool: boolean) {
      if (!bool) return
      this.$emit('update:channel', {
        ...this.channel,
        you_muted: false,
      })
    },
  },
})
</script>
