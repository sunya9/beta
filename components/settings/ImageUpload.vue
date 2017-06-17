<template>
  <div>
    <h3 class="card-title">
      Image upload(using imgur)
      <small class="text-warning">experimental</small>
    </h3>
    <p class="card-text">
      You can attach images if login with imgur.
      Login info are stored in your browser(Local storage).
    </p>
    <div>
      <div v-if="!imgur">
        <button @click="login" class="btn btn-primary">Login with imgur</button>
      </div>
      <div v-else>
        <p class="card-text">
          Your current token: {{imgur.access_token}}
        </p>
        <button @click="logout" class="btn btn-outline-primary">Remove token</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const IMGUR_LOGIN = 'imgur-login'
export default {
  data() {
    return {
      imgur: undefined
    }
  },
  mounted() {
    try {
      const tokenStr = localStorage.getItem('imgur')
      if(tokenStr)
        this.imgur = JSON.parse(tokenStr)
    } catch (e) {
    }
  },
  methods: {
    login() {
      const wnd = window.open('/imgur/login', IMGUR_LOGIN, 'resizable=yes,scrollbars=yes')
      wnd.addEventListener('unload', this.setToken)
      wnd.addEventListener('beforeunload', this.setToken)
    },
    setToken() {
      const imgur = localStorage.getItem('imgur')
        this.imgur = imgur
          ? JSON.parse(imgur)
          : null
    },
    logout() {
      localStorage.removeItem('imgur')
      this.imgur = null
    }
  }
}
</script>