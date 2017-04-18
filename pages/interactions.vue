<template>
  <div>
    <div class="d-flex justify-content-between">
      <h3>Interactions</h3>
      <div
        class="btn-group"
        role="group"
        aria-label="Filter"
        data-toggle="buttons">
        label.btn.btn-primary.
      </div>
    </div>
    <div>
      <list :data="data" type="Interaction" />
    </div>
  </div>
</template>

<script>
import Compose from '~components/Compose'
import List from '~components/List'
import api from '~plugins/api'

export default {
  async asyncData(ctx) {
    const data = await api(ctx).fetch()
    return { data }
  },
  computed: {
    filteredData () {
      const interactions = this.data.data
        .filter (interaction => {
          interaction
        })
      Object.assign({}, this.data, {
        data: interactions
      })
      return data
    }
  }
  components: {
    List,
    Compose
  }
}
</script>