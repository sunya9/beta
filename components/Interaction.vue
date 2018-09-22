<template>
  <div class="media pt-2 w-100">
    <div class="d-inline-block mr-4 text-muted">
      <font-awesome-icon
        :icon="icon"
        fixed-width
        size="2x"
      />
    </div>
    <div class="media-body">
      <h6 class="text-gray-dark">
        <ul class="list-inline">
          <li
            v-for="user in filteredUsers"
            v-if="user.content"
            :key="user.id"
            class="list-inline-item">
            <nuxt-link :to="`@${user.username}`">
              <avatar
                :avatar="user.content.avatar_image"
                size="32"
                max-size="64"
              />
            </nuxt-link>
          </li>
        </ul>
      </h6>
      <div class="my-3">
        <nuxt-link
          v-if="post"
          :to="`@${interaction.objects[0].user.username}/posts/${interaction.objects[0].id}`">
          This post
        </nuxt-link>
        {{ actionBy }}
        <ul class="list-inline d-inline">
          <li
            v-for="(user, i) in filteredUsers"
            :key="user.id"
            class="list-inline-item">
            <nuxt-link :to="`@${user.username}`">
              @{{ user.username }}
              <span v-if="i < filteredUsers.length - 1">, </span>
            </nuxt-link>
          </li>
        </ul>.
        <div class="card mt-3">
          <div class="card-body">
            <post
              v-if="post"
              :post="post"
              view-only
              preview />
          </div>
        </div>
      </div>
      <footer>
        <ul class="list-inline">
          <li class="list-inline-item">
            <span
              :title="absDate"
              class="text-muted">
              <font-awesome-icon :icon="['far', 'clock']" />
              {{ date }}
            </span>
          </li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<script>
import Post from '~/components/Post'
import Avatar from '~/components/Avatar'
import listItem from '~/assets/js/list-item'

const convert = {
  follow: {
    text: 'Followed',
    icon: 'user-plus'
  },
  bookmark: {
    text: 'starred',
    icon: 'star'
  },
  reply: {
    text: 'replied to',
    icon: 'reply'
  },
  repost: {
    text: 'reposted',
    icon: 'retweet'
  }
}

export default {
  components: {
    Post,
    Avatar
  },
  mixins: [listItem],
  props: {
    interaction: {
      type: Object,
      required: true
    }
  },
  dateKey: 'interaction.event_date',
  computed: {
    actionBy() {
      return `${convert[this.interaction.action].text} by`
    },
    icon() {
      return convert[this.interaction.action].icon
    },
    html() {
      switch (this.interaction.action) {
        case 'bookmark':
        case 'reply':
        case 'repost':
          return 'This post'
      }
    },
    post() {
      return this.interaction.action !== 'follow'
        ? this.interaction.objects[0]
        : null
    },
    filteredUsers() {
      return this.interaction.users.filter((user, i, ary) => {
        return !ary.slice(0, i).some(user2 => user.id === user2.id)
      })
    }
  }
}
</script>
