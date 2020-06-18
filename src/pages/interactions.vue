<template>
  <div>
    <div class="d-none justify-content-between flex-wrap">
      <div class="btn-group" role="group">
        <label
          class="btn"
          :class="{ 'btn-outline-primary': !reply, 'btn-primary': reply }"
        >
          <input
            v-model="reply"
            type="checkbox"
            class="sr-only"
            @input="changeFilter"
          />
          Reply
        </label>
        <label
          class="btn"
          :class="{ 'btn-outline-primary': !repost, 'btn-primary': repost }"
        >
          <input
            v-model="repost"
            type="checkbox"
            class="sr-only"
            @input="changeFilter"
          />
          Repost
        </label>
        <label
          class="btn"
          :class="{ 'btn-outline-primary': !bookmark, 'btn-primary': bookmark }"
        >
          <input
            v-model="bookmark"
            type="checkbox"
            class="sr-only"
            @input="changeFilter"
          />
          Star
        </label>
        <label
          class="btn"
          :class="{ 'btn-outline-primary': !follow, 'btn-primary': follow }"
        >
          <input
            v-model="follow"
            type="checkbox"
            class="sr-only"
            @input="changeFilter"
          />
          Follow
        </label>
      </div>
    </div>
    <div>
      <interaction-list :list-info="listInfo" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { ListInfo } from '../plugins/domain/usecases/getList'
import { Interaction } from '../models/interaction'
import InteractionList from '~/components/InteractionList.vue'

@Component({
  middleware: ['auth'],
  components: {
    InteractionList,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getInteractions.run({
      interactionType: ['bookmark', 'repost', 'follow'],
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Interactions',
    }
  },
  watchQuery: ['filters'],
})
export default class Interactions extends Vue {
  listInfo!: ListInfo<Interaction<any>>
  reply = false
  repost = true
  bookmark = true
  follow = true
  async changeFilter() {
    await this.$nextTick()
    const query: Record<string, boolean> = {
      reply: this.reply,
      repost: this.repost,
      bookmark: this.bookmark,
      follow: this.follow,
    }
    const filters = Object.keys(query)
      .filter((key) => query[key])
      .join(',')
    this.$router.push({
      path: '/interactions',
      query: {
        filters,
      },
    })
  }
}
</script>
