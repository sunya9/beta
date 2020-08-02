<template>
  <poll v-if="poll" :poll="poll" />
  <div v-else class="text-center">
    <div class="spinner-border text-primary" role="status" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Poll } from '~/entity/poll'
import PollView from '~/components/organisms/Poll.vue'
import { PollNotice } from '~/entity/raw/raw/poll-notice'
@Component({
  components: { Poll: PollView },
})
export default class PollNoticeView extends Vue {
  @Prop({ type: Object, required: true })
  pollNoticeValue!: PollNotice.Value

  poll: null | Poll = null
  mounted() {
    this.getPoll()
  }

  async getPoll() {
    const {
      res: { data: poll },
    } = await this.$interactors.getPoll.run({
      pollId: this.pollNoticeValue.poll_id,
      pollToken: this.pollNoticeValue.poll_token,
    })
    this.poll = poll
  }
}
</script>
