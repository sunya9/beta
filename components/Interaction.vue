<template>
  <li @focus="focus" tabindex="-1" class="list-group-item list-group-item-action">
    <div class="media pt-2">
      <div class="d-inline-block mr-4 text-muted">
        <i
          :class="icon"
          class="fa fa-fw fa-2x"></i>
      </div>
      <div class="media-body">
        <h6 class="text-gray-dark">
          <nuxt-link
             v-if="action.action !== 'follow'"
            :to="`@${action.objects[0].user.username}/posts/${action.objects[0].id}`">
            This post
          </nuxt-link>
          {{actionBy}}
          <ul class="list-inline d-inline">
            <li class="list-inline-item" :key="user.id" v-for="(user, i) in action.users">
              <nuxt-link :to="`@${user.username}`">
                @{{user.username}}
                <span v-if="i < action.users.length - 1">, </span>
              </nuxt-link>
            </li>
          </ul>.
        </h6>
        <ul class="list-inline my-3">
          <li :key="user.id" v-if="user.content" class="list-inline-item" v-for="user in action.users">
            <nuxt-link :to="`@${user.username}`">
              <img
                width="32"
                height="32"
                class="rounded-circle"
                :src="user.content.avatar_image.link">
            </nuxt-link>
          </li>
        </ul>
        <footer>
          <ul class="list-inline">
            <li class="list-inline-item">
              <span class="text-muted" :title="absDate">
                <i class="fa fa-clock-o"></i>
                {{date}}
              </span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </li>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import focus from '~assets/js/focus'

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
    text: 'replied',
    icon: 'fa-reply'
  },
  repost: {
    text: 'reposted',
    icon: 'fa-retweet'
  }
}

export default {
  mixins: [focus],
  props: ['data'],
  data() {
    return {
      date: null
    }
  },
  mounted() {
    setInterval(this.dateUpdate, 1000 * 30) // 30sec
    this.dateUpdate()
  },
  computed: {
    absDate() {
      return moment(this.action.event_date).format()
    },
    action() {
      return this.data
    },
    users() {
      return this.action.users
        .map(user => user.username)
        .join(', ')
    },
    actionBy() {
      return `${convert[this.action.action].text} by`
    },
    icon() {
      return convert[this.action.action].icon
    },
    html() {
      switch(this.action.action) {
        case 'bookmark':
        case 'reply':
        case 'repost':
          return 'This post'
      }
    }
  },
  methods: {
    dateUpdate() {
      this.date = moment(this.action.event_date).fromNow(true)
    },
  }
}
</script>