<template>
  <div>
    <custom-checkbox v-model="notification" :disabled="disabledNotification">
      Enable notification
      <span v-if="error" :class="`text-${error.type}`">
        {{ error.message }}
      </span>
    </custom-checkbox>
    <custom-checkbox v-model="types.posts" :disabled="!notification">
      New posts
    </custom-checkbox>
    <custom-checkbox v-model="types.mentions" :disabled="!notification">
      New mentions
    </custom-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomCheckbox from '../CustomCheckbox.vue'

export default Vue.extend({
  components: {
    CustomCheckbox,
  },
  data() {
    return {
      notification: false,
      types: {
        posts: false,
        mentions: false,
      },
      disabledNotification: false,
      error: null as { type: string; message: string } | null,
    }
  },
  watch: {
    notification(newVal: boolean) {
      localStorage.setItem('notification', newVal.toString())
      if (newVal) {
        Notification.requestPermission(this.checkPermission)
      }
    },
    'types.posts'(newVal: boolean) {
      localStorage.setItem('notification:posts', newVal.toString())
    },
    'types.mentions'(newVal: boolean) {
      localStorage.setItem('notification:mentions', newVal.toString())
    },
  },
  mounted() {
    this.checkPermission()
    Object.keys(this.types).forEach((key) => {
      // TODO
      ;(this as any).types[key] =
        localStorage.getItem(`notification:${key}`) === 'true'
    })
  },
  methods: {
    checkPermission() {
      this.disabledNotification =
        !('Notification' in window) || Notification.permission === 'denied'
      if (!('Notification' in window)) {
        this.error = {
          type: 'warning',
          message: 'Your browser does not support notification.',
        }
      } else if (Notification.permission === 'denied') {
        this.error = {
          type: 'danger',
          message:
            'You have to unblock notification from your browser settings.',
        }
      }
      this.notification =
        !this.disabledNotification &&
        localStorage.getItem('notification') === 'true'
    },
  },
})
</script>
