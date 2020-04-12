<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <div class="btn-group" role="group" style="display: none;">
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" value="reply" />
          Reply
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" value="repost" />
          Repost
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" value="bookmark" />
          Star
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" value="follow" />
          Follow
        </label>
      </div>
    </div>
    <div>
      <interaction-list :data="data" :option="options" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InteractionList from '~/components/InteractionList.vue'

export default Vue.extend({
  middleware: ['auth'],
  components: {
    InteractionList,
  },
  async asyncData({ app: { $resource } }) {
    const options = {
      filters: 'bookmark,repost,follow',
    }
    const data = await $resource({ options })
    return { data, options }
  },
  head() {
    return {
      title: 'Interactions',
    }
  },
})
</script>
