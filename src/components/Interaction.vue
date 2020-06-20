<template>
  <div class="media pt-2 w-100">
    <div class="d-inline-block mr-4 text-muted">
      <font-awesome-icon :icon="icon" fixed-width size="2x" />
    </div>
    <div class="media-body">
      <h6 class="text-gray-dark">
        <ul class="list-inline">
          <template v-for="user in filteredUsers">
            <li v-if="user.content" :key="user.id" class="list-inline-item">
              <user-popper :user="user">
                <nuxt-link :to="`@${user.username}`">
                  <avatar
                    :avatar="user.content.avatar_image"
                    size="32"
                    max-size="64"
                  />
                </nuxt-link>
              </user-popper>
            </li>
          </template>
        </ul>
      </h6>
      <div class="my-3">
        <nuxt-link v-if="post" :to="`@${post.user.username}/posts/${post.id}`">
          This post
        </nuxt-link>
        {{ actionBy }}
        <template v-for="(user, i) in filteredUsers">
          <nuxt-link
            :key="user.id"
            :to="`@${user.username}`"
            v-text="`@${user.username}`"
          />
          <span
            v-if="i < filteredUsers.length - 1"
            :key="`comma-${i}`"
            v-text="`, `"
          />
        </template>
        .
        <div v-if="post" class="card mt-3">
          <div class="card-body">
            <post :post="post" view-only preview />
          </div>
        </div>
      </div>
      <footer>
        <ul class="list-inline">
          <li class="list-inline-item">
            <span :title="absDate" class="text-muted">
              <font-awesome-icon :icon="['far', 'clock']" />
              {{ date }}
            </span>
          </li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import Post from '~/components/Post.vue'
import Avatar from '~/components/atoms/Avatar.vue'
import UserPopper from '~/components/molecules/UserPopper.vue'
import listItem from '~/assets/ts/list-item'
import { Interaction } from '~/models/interaction'

const convert: {
  [key in Interaction.ActionType]: {
    text: string
    icon: string
  }
} = {
  follow: {
    text: 'Followed',
    icon: 'user-plus',
  },
  bookmark: {
    text: 'starred',
    icon: 'star',
  },
  reply: {
    text: 'replied to',
    icon: 'reply',
  },
  repost: {
    text: 'reposted',
    icon: 'retweet',
  },
  // TODO
  poll_response: {
    text: 'Poll',
    icon: 'poll',
  },
}

@Component({
  components: {
    Post,
    Avatar,
    UserPopper,
  },
})
export default class InteractionView extends Mixins(
  listItem('interaction.event_date')
) {
  @Prop({ required: true })
  interaction!: Interaction

  get actionBy() {
    return `${convert[this.interaction.action].text} by`
  }

  get icon() {
    return convert[this.interaction.action].icon
  }

  get post() {
    return this.interaction.action !== 'follow'
      ? this.interaction.objects[0]
      : null
  }

  get filteredUsers() {
    if (!this.interaction.users) return []
    return this.interaction.users.filter((user, i, ary) => {
      return !ary.slice(0, i).some((user2) => user.id === user2.id)
    })
  }
}
</script>
