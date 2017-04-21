<template>
  <li :id="`post-${post.id}`" class="list-group-item list-group-item-action">
    <div class="media w-100 justify-content-start">
      <nuxt-link :to="`/@${mainPost.user.username}`">
        <img :src="mainPost.user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle iconSize"
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
        <div class="d-flex">
          <p @click="clickPostLink" v-html="html">
          </p>
          <div v-if="thumbs.length" class="ml-auto mr-3">
            <thumb
              :original="t.original"
              :thumb="t.thumb"
              :key="i"
              v-for="(t, i) in thumbs" />
          </div>
        </div>
        <footer>
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
            <template v-if="!viewOnly">
              <li class="list-inline-item" v-show="post.reply_to">
                <nuxt-link :to="`/posts/${post.id}`" class="text-muted" :title="absDate">
                  <i class="fa fa-comments"></i>
                </nuxt-link>
              </li>
            </template>
            <template v-if="!viewOnly && user">
              <li class="list-inline-item reply">
                <a class="text-muted" href="#" @click.prevent="reply">
                  <i class="fa fa-reply"></i>
                  Reply
                </a>
              </li>
            </template>
            <template v-if="!viewOnly && me">
              <li class="list-inline-item remove">
                <a class="text-muted"
                  href="#"
                  data-toggle="modal"
                  :data-target="`#post-${post.id} .remove-modal`"
                  >
                  <i class="fa fa-trash"></i>
                  Remove
                </a>
              </li>
            </template>
            <template v-if="!viewOnly || !user">
              <li class="list-inline-item source">
                <a class="text-muted" :href="post.source.link" target="_new">
                <i class="fa fa-send"></i>
                via {{mainPost.source.name}}
                </a>
              </li>
            </template>
          </ul>
        </footer>
        <template v-if="detail">
          <hr>
          <ul class="list-inline">
            <li class="list-inline-item">
              <div class="count">
                {{post.counts.replies}}
              </div>
              <small class="text-muted">replies</small>
              </li>
            <li class="list-inline-item">
              <div class="count">
                {{post.counts.reposts}}
              </div>
              <small class="text-muted">reposts</small>
            </li>
            <li class="list-inline-item">
              <div class="count">
                {{post.counts.bookmarks}}
              </div>
              <small class="text-muted">stars</small>
            </li>
          </ul>
        </template>
      </div>
      <div class="ml-auto mt-1" v-if="!viewOnly && user">
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
import Thumb from '~components/Thumb'
import { mapState } from 'vuex'
import api from '~plugins/api'
import router from '~router'
import cheerio from 'cheerio'
import bus from '~assets/js/bus'

export default {
  props: {
    data: Object,
    viewOnly: Boolean,
    detail: Boolean
  },
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
        const $ = cheerio.load(this.mainPost.content.html)
        $('a').attr('target', '_new')
        $('span[data-mention-name]')
          .replaceWith(function () {
            const name = $(this).data('mention-name')
            const text = $(this).text()
            return `<a href="/@${name}">${text}</a>`
          })
        $('span[data-tag-name]')
          .replaceWith(function () {
            const tag = $(this).data('tag-name')
            const text = $(this).text()
            return `<a href="/tags/${tag}">${text}</a>`
          })
        return $.html()
      }
    },
    thumbs() {
      if(!this.mainPost.content) return []
      const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/
      const photos = []
      const linkPhotos = this.mainPost
        .content.entities.links
        .filter(link => imgExt.test(link.link))
        .map(link => {
          return {
            original: link.link,
            thumb: link.link
          }
        })
      Array.prototype.push.apply(photos, linkPhotos)
      if(this.mainPost.raw) {
        const embedPhotos = this.mainPost.raw.filter(r => {
          return r.type === 'io.pnut.core.oembed'
            && r.value.type === 'photo'
        }).map(r => {
          return {
            original: r.value.url,
            thumb: r.value.thumbnail_url || r.value.url
          }
        })
        Array.prototype.push.apply(photos, embedPhotos)
      }
      return photos
    },
    absDate() {
      return moment(this.mainPost.created_at).format()
    },
    post() {
      return this.data
    },
    me() {
      return this.user && this.user.id === this.post.user.id
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
      bus.$emit('setReply', this.post)
    },
    remove() {
      return api().delete(`/posts/${this.post.id}`)
        .then(() => {
          this.$emit('remove')
        })
    },
    clickPostLink (e) {
      const a = e.target
      if (!a.href || !a.getAttribute('href').startsWith('/')) return
      e.preventDefault()
      router.push(a.pathname)
    }
  },
  components: {
    Modal,
    ActionButton,
    Thumb
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';
@import '~bootstrap/scss/mixins/breakpoints';
@import '~bootstrap/scss/variables';

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
.count {
  line-height: 1;
}
.iconSize {
  width: 48px;
  height: 48px;
  @include media-breakpoint-up(sm) {
    width: 64px;
    height: 64px;
  }
}
</style>