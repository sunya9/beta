<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="mb-4">Interactions</h3>
      <div class="btn-group" role="group" style="display: none">
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" v-model="filter" value="reply"> Reply
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" v-model="filter" value="repost"> Repost
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" v-model="filter" value="bookmark"> Star
        </label>
        <label class="btn btn-primary">
          <input type="checkbox" class="sr-only" :class="active" v-model="filter" value="follow"> Follow
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
  async asyncData (ctx) {
    const data = await api(ctx).fetch()
    return { data }
  },
  data () {
    return {
      filter: []
    }
  },
  computed: {
    filteredData () {
      const interactions = this.data.data
        .filter(interaction => {
          const res = !this.filter.length ||
          this.filter.indexOf(interaction.action) >= 0
          return res
        })
      const data = Object.assign({}, this.data, {
        data: interactions
      })
      return data
    }
  },
  methods: {
    active (e) {
    }
  },
  components: {
    List,
    Compose
  },
  head: {
    title: 'Interactions'
  }
}
</script>