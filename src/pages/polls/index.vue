<template>
  <div>
    <h3 class="d-flex align-items-center mb-4">
      Your polls
    </h3>
    <poll-list :list-info="listInfo" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import PollList from '~/components/organisms/PollList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { Poll } from '~/models/poll'

@Component({
  middleware: ['auth'],
  components: {
    PollList,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPolls.run({})
    return { listInfo }
  },
  head() {
    return {
      title: 'Your polls',
    }
  },
})
export default class Polls extends Vue {
  readonly listInfo!: ListInfo<Poll>
}
</script>
