<template>
  <button
    class="btn"
    :class="btnClass"
    @click="follow">
    {{text}}
  </button>

</template>

<script>
export default {
  props: ['initialState'],
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

    }
  }
}

</script>