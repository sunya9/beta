<template>
  <div v-if="normalizedUsers.length">
    <h5 v-if="!noHeading">
      {{ heading }}
    </h5>
    <ul class="list-unstyled">
      <li v-for="user in normalizedUsers" :key="user.id" class="mb-2">
        <nuxt-link
          :to="`/@${user.username}`"
          :class="{ 'disabled-link': !user.id }"
          class="d-flex flex-row align-items-center flex-nowrap"
        >
          <avatar
            :avatar="user.avatar_image"
            size="24"
            max-size="24"
            class="mr-2"
          />
          <div class="d-flex align-items-baseline flex-wrap">
            @{{ user.username }}
            <emojify :text="user.name" class="ml-1 text-muted" />
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Avatar from '~/components/Avatar.vue'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'

type Kind = 'owner' | 'full' | 'write' | 'read'

const headingMap: {
  [key in Kind]: string
} = {
  owner: 'Owner',
  full: 'Moderators',
  write: 'Writers',
  read: 'Readers'
}

export default Vue.extend({
  name: 'ChannelUserList',
  components: {
    Avatar
  },
  props: {
    users: {
      type: Array,
      default: () => []
    } as PropOptions<Channel.SimpleUser[]>,
    owner: {
      type: Object,
      default: null
    } as PropOptions<User | null>,
    kind: {
      type: String,
      required: true,
      validator: kind => Object.keys(headingMap).includes(kind)
    } as PropOptions<Kind>,
    noHeading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    heading(): string {
      return headingMap[this.kind]
    },
    normalizedUsers(): Channel.SimpleUser[] {
      if (
        !this.owner ||
        !this.owner.content ||
        !this.owner.content.avatar_image
      )
        return this.users
      const res = [...this.users]
      const {
        name,
        id,
        username,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.owner
      res.unshift({
        name,
        id,
        username,
        avatar_image
      })
      return res
    }
  }
})
</script>
