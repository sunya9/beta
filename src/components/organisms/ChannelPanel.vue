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
          <slot name="memberTitle">Members</slot>
        </h2>
        <slot name="memberList" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import CustomCheckbox from '~/components/atoms/CustomCheckbox.vue'
import { User } from '~/entity/user'
import { Channel } from '~/entity/channel'

@Component({
  components: {
    CustomCheckbox,
  },
})
export default class ChannelPanel extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  channel!: Channel

  get user(): User | null {
    return this.$accessor.user
  }

  async markAsRead() {
    if (!this.channel.recent_message_id) return
    await this.$interactors.markAsRead.run({
      id: this.channel.recent_message_id,
      type: 'channel',
      channelId: this.channel.id,
    })
    this.channel.has_unread = false
  }

  cancelSubscribe(bool: boolean) {
    if (!bool) return
    this.$emit('update:channel', {
      ...this.channel,
      you_subscribed: false,
    })
  }

  cancelMute(bool: boolean) {
    if (!bool) return
    this.$emit('update:channel', {
      ...this.channel,
      you_muted: false,
    })
  }
}
</script>
