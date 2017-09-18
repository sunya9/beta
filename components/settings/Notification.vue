<template>
  <div>
    <h3 class="card-title">Notification</h3>
    <custom-checkbox v-model="notification" :disabled="disabledNotification">
      Enable notification <span :class="`text-${error.type}`" v-if="error">{{error.message}}</span>
    </custom-checkbox>
    <custom-checkbox v-model="types.posts" :disabled="!notification">
      New posts
    </custom-checkbox>
    <custom-checkbox v-model="types.mentions" :disabled="!notification">
      New mentions
    </custom-checkbox>
  </div>
</template>

<script>
import CustomCheckbox from '../CustomCheckbox'

export default {
  data () {
    return {
      notification: false,
      types: {
        posts: false,
        mentions: false
      },
      disabledNotification: false,
      error: null
    }
  },
  mounted () {
    this.checkPermission()
    Object.keys(this.types).forEach(key => {
      this.types[key] = localStorage.getItem(`notification:${key}`) === 'true'
    })
  },
  watch: {
    notification (newVal) {
      localStorage.setItem('notification', newVal)
      if (newVal) {
        Notification.requestPermission(this.checkPermission)
      }
    },
    'types.posts' (newVal) {
      localStorage.setItem('notification:posts', newVal)
    },
    'types.mentions' (newVal) {
      localStorage.setItem('notification:mentions', newVal)
    }
  },
  methods: {
    checkPermission () {
      this.disabledNotification = !('Notification' in window) || Notification.permission === 'denied'
      if (!('Notification' in window)) {
        this.error = {
          type: 'warning',
          message: 'Your browser does not support notification.'
        }
      } else if (Notification.permission === 'denied') {
        this.error = {
          type: 'danger',
          message: 'You have to unblock notification from your browser settings.'
        }
      }
      this.notification = !this.disabledNotification && localStorage.getItem('notification') === 'true'
    }
  },
  components: {
    CustomCheckbox
  }
}
</script>

