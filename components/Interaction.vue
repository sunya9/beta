<template>
  <li @focus="focus" tabindex="-1" class="list-group-item list-group-item-action" @click="$emit('click')">
    <div class="media pt-2 w-100">
      <div class="d-inline-block mr-4 text-muted">
        <i
          :class="icon"
          class="fa fa-fw fa-2x"></i>
      </div>
      <div class="media-body">
        <h6 class="text-gray-dark">
          <ul class="list-inline">
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
        </h6>
        <div class="my-3">
          <nuxt-link
             v-if="post"
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
            <ul class="list-group">
              <post class="mt-3" :data="post" view-only preview />
            </ul>
        </div>
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
import focus from '~assets/js/focus'
import Post from '~components/Post'

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
  mixins: [focus],
  props: ['data'],
  data () {
    return {
      date: null
    }
  },
  mounted () {
    setInterval(this.dateUpdate, 1000 * 30) // 30sec
    this.dateUpdate()
  },
  computed: {
    absDate () {
      return moment(this.action.event_date).format()
    },
    action () {
      return this.data
    },
    users () {
      return this.action.users
        .map(user => user.username)
        .join(', ')
    },
    actionBy () {
      return `${convert[this.action.action].text} by`
    },
    icon () {
      return convert[this.action.action].icon
    },
    html () {
      switch (this.action.action) {
        case 'bookmark':
        case 'reply':
        case 'repost':
          return 'This post'
      }
    },
    post () {
      return this.action.action !== 'follow'
        ? this.action.objects[0]
        : null
    }
  },
  methods: {
    dateUpdate () {
      this.date = moment(this.action.event_date).fromNow(true)
    }
  },
  components: {
    Post
  }
}
</script>