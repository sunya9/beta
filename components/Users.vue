<template>
  <div>
    <h3 class="my-2">
      <slot></slot>
    </h3>
    <ul class="list-group my-4">
      <user :user="user" :key="user.id" v-for="user in users" />
    </ul>
  </div>
</template>

<script>
import User from '~/components/User'

export default {
  props: ['users'],
  components: {
    User
  }
}
</script>
