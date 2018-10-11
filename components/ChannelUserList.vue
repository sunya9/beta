<template>
  <div v-if="normalizedUsers.length">
    <h5 v-if="!noHeading">{{ heading }}</h5>
    <ul class="list-unstyled">
      <li
        v-for="user in normalizedUsers"
        :key="user.id"
        class="mb-2">
        <nuxt-link
          :to="`/@${user.username}`"
          :class="{ 'disabled-link': !user.id }"
          class="d-flex flex-row align-items-center flex-nowrap">
          <avatar
            :avatar="user.avatar_image"
            size="24"
            max-size="24"
            class="mr-2" />
          <div class="d-flex align-items-baseline flex-wrap">
            @{{ user.username }}
            <emojify
              :text="user.name"
              class="ml-1 text-muted"
            />
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
import Avatar from '~/components/Avatar'
const headingMap = {
  owner: 'Owner',
  full: 'Moderators',
  write: 'Writers',
  read: 'Readers'
}
export default {
  components: {
    Avatar
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: null
    },
    kind: {
      type: String,
      required: true,
      validator: kind => ['owner', 'full', 'write', 'read'].includes(kind)
    },
    noHeading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    heading() {
      return headingMap[this.kind]
    },
    normalizedUsers() {
      if (!this.user) return this.users
      const res = [...this.users]
      const {
        name,
        id,
        username,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.user
      res.unshift({
        name,
        id,
        username,
        avatar_image
      })
      return res
    }
  }
}
</script>
