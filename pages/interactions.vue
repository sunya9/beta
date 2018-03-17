<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <div class="btn-group" role="group" style="display: none">
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" value="reply"> Reply
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" value="repost"> Repost
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" value="bookmark"> Star
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" value="follow"> Follow
        </label>
      </div>
    </div>
    <div>
      <list :data="data" type="Interaction" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'

export default {
  middleware: 'authenticated',
  async asyncData(ctx) {
    const option = {
      filters: 'bookmark,repost,follow'
    }
    const data = await api(ctx).fetch(option)
    return { data }
  },
  methods: {
    active() {}
  },
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Interactions'
    }
  }
}
</script>
