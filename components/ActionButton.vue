<template>
  <a @click.prevent="click" href="#" class="btn btn-link btn-lg my-0 py-1 mx-0 px-0 rounded-0">
    <i :class="[computedIcon, { active: state }]" class="icon-button fa fa-lg fa-fw"></i>
  </a>
</template>

<script>
import axios from 'axios'

export default {
  props: ['icon', 'initialState', 'resource'],
  data() {
    return {
      state: this.initialState
    }
  },
  methods: {
    click() {
      return axios[this.method](this.resource)
        .then(() => { this.state = !this.state })
    }
  },
  computed: {
    computedIcon() {
      if (typeof this.icon === 'object') {
        return this.icon[+this.state]
      } else {
        return this.icon
      }
    },
    method() {
      return this.state ? 'delete' : 'put'
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/override';

.icon-button {
  color: #b0b0b0;
}

.active {
  color: $themeAttention;
}
</style>
