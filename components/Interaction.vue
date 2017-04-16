<template>
  <li class="list-group-item list-group-item-action">
    <div class="media">
      <div class="d-inline-block mr-4 text-muted">
        <i
          :class="icon"
          class="fa fa-fw fa-2x"></i>
      </div>
      <div class="media-body">
        <h6 class="mt-1 text-gray-dark">
          {{actionBy}}
          <ul class="list-inline d-inline">
            <li class="list-inline-item" v-for="(user, i) in action.users">
              <nuxt-link :to="`@${user.username}`">
                @{{user.username}}
                <span v-if="i < action.users.length - 1">, </span>
              </nuxt-link>
            </li>
          </ul>
          <small class="text-muted">
          </small>
        </h6>
        <p></p>
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

const convert = {
  follow: {
    text: 'Followed',
    icon: 'fa-user-plus'
  },
  bookmark: {
    text: 'Starred',
    icon: 'fa-star'
  },
  reply: {
    text: 'Replied',
    icon: 'fa-reply'
  },
  repost: {
    text: 'Reposted',
    icon: 'fa-retweet'
  }
}

export default {
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
    }
  },
  methods: {
    dateUpdate() {
      this.date = moment(this.action.event_date).fromNow(true)
    },
  }
}
</script>