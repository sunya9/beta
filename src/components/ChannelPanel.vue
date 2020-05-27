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
            @change="() => markAsRead(channel)"
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
import { Component, Prop, Mixins } from 'vue-property-decorator'
import markAsRead from '~/assets/ts/mark-as-read'
import CustomCheckbox from '~/components/CustomCheckbox.vue'
import { User } from '~/models/user'
import { Channel } from '~/models/channel'

@Component({
  components: {
    CustomCheckbox,
  },
})
export default class ChannelPanel extends Mixins(markAsRead) {
  @Prop({
    type: Object,
    required: true,
  })
  channel!: Channel

  get user(): User | null {
    return this.$accessor.user
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
