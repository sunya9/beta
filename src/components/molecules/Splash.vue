<template>
  <div class="text-center">
    <h1 class="display-4">Welcome to Beta!</h1>
    <p class="lead">
      Web client for
      <a href="https://pnut.io">pnut.io</a>
      <span>.</span>
    </p>
    <p>
      <button
        type="button"
        class="btn btn-primary btn-lg"
        @click="$auth.loginWith('pnut')"
      >
        Login with pnut.io
        <font-awesome-icon icon="chevron-right" />
      </button>
    </p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
