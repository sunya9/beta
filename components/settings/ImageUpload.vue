<template>
  <div>
    <h3 class="card-title">
      Image upload(using imgur)
      <small class="text-danger">Deprecated</small>
    </h3>
    <p class="card-text">
      This feature is deprecated. In current version,  implemented by files API. It is possible for <a href="https://pnut.io/account/support" target="_new">payment users</a> to use this feature.
    </p>
    <div v-if="imgur">
      <p class="card-text">
        If you would like to remove imgur's token in your browser, press the button below.
      </p>
      <p class="card-text">
        Your current token: {{imgur.access_token}}
      </p>
      <button @click="logout" class="btn btn-outline-primary">Remove token</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgur: undefined
    }
  },
  mounted() {
    try {
      const tokenStr = localStorage.getItem('imgur')
      if (tokenStr) { this.imgur = JSON.parse(tokenStr) }
    } catch (e) {
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('imgur')
      this.imgur = null
    }
  }
}
</script>
