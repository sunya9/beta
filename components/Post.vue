<template>
  <li :id="`post-${post.id}`" class="list-group-item list-group-item-action">
    <div class="media w-100 justify-content-start">
      <nuxt-link :to="`/@${mainPost.user.username}`">
        <img :src="mainPost.user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <h6 class="mt-1">
          <nuxt-link
            :to="`/@${mainPost.user.username}`"
            class="text-gray-dark">
            {{mainPost.user.username}}
            <small class="text-muted">
              {{mainPost.user.name}}
            </small>
          </nuxt-link>
        </h6>
        <p @click.prevent="clickPostLink" v-html="html"></p>
        <footer v-if="!viewOnly">
          <div v-if="post.repost_of">
            <nuxt-link :to="`/@${post.user.username}`" class="text-muted">
              <i class="fa fa-retweet"></i>&nbsp;
              Reposted by @{{post.user.username}}
            </nuxt-link>
          </div>
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
            <li v-if="me" class="list-inline-item remove">
              <a class="text-muted"
                href="#"
                data-toggle="modal"
                :data-target="`#post-${post.id} .remove-modal`"
                >
                <i class="fa fa-trash"></i>
                Remove
              </a>
            </li>
            <li class="list-inline-item source">
              <a class="text-muted" :href="post.source.link">
              <i class="fa fa-send"></i>
              from
                {{mainPost.source.name}}
              </a>
            </li>
          </ul>
        </footer>
      </div>
      <div class="ml-auto mt-1" v-if="!viewOnly">
        <div class="btn-group-vertical" role="group">
          <action-button
            :resource="`/posts/${mainPost.id}/bookmark`"
            :icon="['fa-star-o', 'fa-star']"
            :initial-state="mainPost.you_bookmarked"
            />
          <action-button
            v-if="!me"
            :resource="`/posts/${mainPost.id}/repost`"
            icon="fa-retweet"
            :initial-state="mainPost.you_reposted"
            />
        </div>
      </div>
    </div>
    <modal class="remove-modal">
      <span slot="header">Remove post?</span>
      <p>Does you remove the post?</p>
      <button
        class="btn btn-primary"
        slot="footer"
        @click="remove"
        data-dismiss="modal">OK</button>
    </modal>
  </li>
</template>

<script>
import moment from 'moment'
import Modal from '~components/Modal'
import ActionButton from '~components/ActionButton'
import { mapState } from 'vuex'
import api from '~plugins/api'
import router from '~router'

export default {
  props: ['data', 'viewOnly'],
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
      if(this.mainPost.content && this.mainPost.content.html) {
        const text = this.mainPost.content.html
          .replace(/(@\w+)/g, '<a href="/$1">$1</a>')
        return text
      }
    },
    absDate() {
      return moment(this.mainPost.created_at).format()
    },
    post() {
      return this.data
    },
    me() {
      return this.user.id === this.post.user.id
    },
    mainPost() {
      return this.post.repost_of || this.post
    },
    ...mapState(['user'])
  },
  methods: {
    dateUpdate() {
      this.date = moment(this.post.created_at).fromNow(true)
    },
    reply() {
      this.$store.commit('SET_REPLY', this.post)
    },
    remove() {
      return api().delete(`/posts/${this.post.id}`)
        .then(() => {
          this.$emit('remove')
        })
    },
    clickPostLink (e) {
      const a = e.target
      if (!a.href) return
      router.push(a.pathname)
    }
  },
  components: {
    Modal,
    ActionButton
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.media-body {
  word-break: break-word;
}

footer {
  font-size: .85rem;
}

.reply, .remove, .source {
  opacity: 0;
  transition: all .2s ease;
}

.list-group-item {
  &:hover, &:focus {
    .reply, .remove, .source {
      opacity: 1;
    }
  }
}
</style>