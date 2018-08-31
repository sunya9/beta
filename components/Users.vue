<template>
  <div>
    <h3 class="my-2">
      <slot/>
    </h3>
    <ul class="list-group my-4">
      <user
        v-for="user in users"
        :user="user"
        :key="user.id" />
    </ul>
  </div>
</template>

<script>
import User from '~/components/User'

export default {
  components: {
    User
  },
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
}
</script>
