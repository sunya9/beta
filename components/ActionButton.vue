<template>
  <a @click.prevent="click" href="#" class="btn btn-link btn-lg my-0 py-1 mx-0 px-0 rounded-0" :class="{ disabled }">
    <i :class="[computedIcon, { active: state }]" class="icon-button fa fa-lg fa-fw"></i>
  </a>
</template>

<script>
import axios from 'axios'

export default {
  props: ['icon', 'initialState', 'resource'],
  data() {
    return {
      state: this.initialState,
      promise: null
    }
  },
  methods: {
    click() {
      this.promise = axios[this.method](this.resource)
      const prev = this.state
      this.state = !this.state
      return this.promise
        .then(() => {
          this.promise = null
        })
        .catch(() => {
          this.promise = null
          this.state = prev
        })
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
    disabled() {
      return this.promise
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
