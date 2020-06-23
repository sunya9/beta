<template>
  <div class="card">
    <div class="card-body">
      <poll :poll="res.data" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Poll from '~/components/Poll.vue'
import { PnutResponse } from '~/models/pnut-response'
@Component({
  components: {
    Poll,
  },
  async asyncData({
    app: { $interactors },
    params: { id },
    query: { poll_token },
  }) {
    const { res } = await $interactors.getPoll.run({
      pollId: id,
      pollToken: poll_token?.toString(),
    })
    return {
      res,
    }
  },
})
export default class PollView extends Vue {
  res!: PnutResponse<Poll>
}
</script>
