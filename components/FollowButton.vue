<template>
  <button
    class="btn"
    :class="btnClass"
    @click="follow">
    {{text}}
  </button>

</template>

<script>
import axios from 'axios'

export default {
  props: ['initialState', 'userId'],
  data() {
    return {
      state: this.initialState
    }
  },
  computed: {
    text() {
      return this.state
        ? 'Following'
        : 'Follow'
    },
    btnClass() {
      return `btn-${this.state ? 'secondary' : 'primary'}`
    }
  },
  methods: {
    follow() {
      const method = this.state ? 'delete' : 'put'
      axios[method](`/proxy/users/${this.userId}/follow`)
        .then(res => this.state = !this.state)
    }
  }
}

</script>