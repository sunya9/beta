<template>
  <li class="list-group-item list-group-item-action">
    <div class="media w-100 justify-content-start">
      <nuxt-link :to="`/@${post.user.username}`">
        <img :src="post.user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <h6 class="mt-1">
          <nuxt-link
            :to="`/@${post.user.username}`"
            class="text-gray-dark">
            {{post.user.username}}
            <small class="text-muted">
              {{post.user.name}}
            </small>
          </nuxt-link>
        </h6>
        <p v-html="html"></p>
        <footer>
          <ul class="list-inline">
            <li class="list-inline-item">
              <nuxt-link :to="`/posts/${post.id}`" class="text-muted" :title="absDate">
                <i class="fa fa-clock-o"></i>
                {{date}}
              </nuxt-link>
            </li>
            <li class="list-inline-item reply">
              <a class="text-muted" href="#" @click.prevent="reply">
                <i class="fa fa-reply"></i>
                Reply
              </a>
            </li>
          </ul>
        </footer>
      </div>
      <div class="ml-auto mt-1">
        <div class="btn-group-vertical" role="group">
          <a @click="star" href="#" @click.prevent class="btn btn-link btn-lg my-0 py-1 mx-0 px-0">
            <i class="icon-button fa fa-star-o fa-lg fa-fw"></i>
          </a>
          <a @click="repost" href="#" @click.prevent
            v-show="user.id !== post.user.id"
            class="btn btn-link btn-lg my-0 py-1 mx-0 px-0">
            <i class="icon-button fa fa-retweet fa-lg fa-fw"></i>
          </a>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

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
    html() {
      if(this.post.content && this.post.content.html)
      return this.post.content.html
    },
    absDate() {
      return moment(this.post.created_at).format()
    },
    post() {
      return this.data
    },
    ...mapState(['user'])
  },
  methods: {
    dateUpdate() {
      this.date = moment(this.post.created_at).fromNow(true)
    },
    star() {

    },
    repost() {

    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.media-body {
  word-break: break-word;
}
.icon-button {
  color: #b0b0b0;
}
footer {
  font-size: .85rem;
}

.reply {
  opacity: 0;
}

.list-group-item {
  &:hover, &:focus {
    .reply {
      opacity: 1;
    }
  }
}
</style>