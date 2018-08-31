<template>
  <li
    tabindex="-1"
    class="list-group-item list-group-item-action"
    @focus="focus"
    @click="$emit('click')">
    <div class="media pt-2 w-100">
      <div class="d-inline-block mr-4 text-muted">
        <i
          :class="icon"
          class="fa fa-fw fa-2x"/>
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
            :to="`@${action.objects[0].user.username}/posts/${action.objects[0].id}`">
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
          <ul class="list-group">
            <post
              v-if="post"
              :data="post"
              class="mt-3"
              view-only
              preview />
          </ul>
        </div>
        <footer>
          <ul class="list-inline">
            <li class="list-inline-item">
              <span
                :title="absDate"
                class="text-muted">
                <i class="fa fa-clock-o"/>
                {{ date }}
              </span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </li>
</template>

<script>
import focus from '~/assets/js/focus'
import Post from '~/components/Post'
import Avatar from '~/components/Avatar'
import listItem from '~/assets/js/list-item'

const convert = {
  follow: {
    text: 'Followed',
    icon: 'fa-user-plus'
  },
  bookmark: {
    text: 'starred',
    icon: 'fa-star'
  },
  reply: {
    text: 'replied to',
    icon: 'fa-reply'
  },
  repost: {
    text: 'reposted',
    icon: 'fa-retweet'
  }
}

export default {
  components: {
    Post,
    Avatar
  },
  mixins: [focus, listItem],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  dateKey: 'action.event_date',
  computed: {
    action() {
      return this.data
    },
    actionBy() {
      return `${convert[this.action.action].text} by`
    },
    icon() {
      return convert[this.action.action].icon
    },
    html() {
      switch (this.action.action) {
        case 'bookmark':
        case 'reply':
        case 'repost':
          return 'This post'
      }
    },
    post() {
      return this.action.action !== 'follow' ? this.action.objects[0] : null
    },
    filteredUsers() {
      return this.action.users.filter((user, i, ary) => {
        return !ary.slice(0, i).some(user2 => user.id === user2.id)
      })
    }
  }
}
</script>
