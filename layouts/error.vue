<template>
  <div class="container text-center">
    <h1>{{ error.statusCode }}</h1>
    <p class="lead">{{ error.message }}</p>
    <nuxt-link
      v-if="error.statusCode"
      :to="error.home || '/'"
      class="btn btn-primary"
    >
      Top
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: {
    error: {
      type: null,
      default: null
    }
  },
  layout: 'no-sidebar',
  head() {
    return {
      title: this.error.statusCode
    }
  }
}
</script>
