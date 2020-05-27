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
import { Component, Watch } from 'vue-property-decorator'
import CustomCheckbox from '../CustomCheckbox.vue'

@Component({
  components: {
    CustomCheckbox,
  },
})
export default class Notifications extends Vue {
  notification = false
  types = {
    posts: false,
    mentions: false,
  }

  disabledNotification = false
  error: { type: string; message: string } | null = null

  @Watch('notification')
  onChangeNotification(newVal: boolean) {
    localStorage.setItem('notification', newVal.toString())
    if (newVal) {
      Notification.requestPermission(this.checkPermission)
    }
  }

  @Watch('types.posts')
  onChangePostType(newVal: boolean) {
    localStorage.setItem('notification:posts', newVal.toString())
  }

  @Watch('types.mentions')
  onChangeMentionType(newVal: boolean) {
    localStorage.setItem('notification:mentions', newVal.toString())
  }

  mounted() {
    this.checkPermission()
    ;(Object.keys(this.types) as (keyof Notifications['types'])[]).forEach(
      (key) => {
        // TODO
        this.types[key] = localStorage.getItem(`notification:${key}`) === 'true'
      }
    )
  }

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
        message: 'You have to unblock notification from your browser settings.',
      }
    }

    this.notification =
      !this.disabledNotification &&
      localStorage.getItem('notification') === 'true'
  }
}
</script>
