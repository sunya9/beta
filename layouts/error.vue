<template>
  <div class="container ta-center">
    <h1>
      {{ error.statusCode }}
    </h1>
    <p class="lead">
      {{ error.message }}
    </p>
    <nuxt-link class="btn btn-primary" :to="error.home || '/'" v-if="error.statusCode">
      Top
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: ['error']
}
</script>
