<template>
  <li @focus="focus" tabindex="-1" :id="`post-${post.id}`" class="list-group-item list-group-item-action" @click="$emit('click')">
    <div :class="{
      deleted: post.is_deleted,
      'h-entry': detail
    }" class="media w-100 justify-content-start">
      <a v-if="detail" v-show=false rel="author" :href="(mainPost.user.verified ? mainPost.user.verified.link : `/@${mainPost.user.username}`)" class="p-author h-card">
        <avatar :avatar="mainPost.user.content.avatar_image"
          class="d-flex mr-3 iconSize u-photo" :alt="(mainPost.user.name || mainPost.user.username)" size="64" max-size="64" />
      </a>
      <nuxt-link :to="`/@${mainPost.user.username}`" v-if="!preview">
        <avatar :avatar="mainPost.user.content.avatar_image"
          class="d-flex mr-3 iconSize" :alt="mainPost.user.username" size="64" max-size="64" />
      </nuxt-link>
      <div class="media-body">
        <h6 class="mt-1">
          <nuxt-link :to="`/@${mainPost.user.username}`" class="text-gray-dark">
            {{mainPost.user.username}}
            <small v-if="mainPost.user.name" class="text-muted">
              {{mainPost.user.name}}
            </small>
          </nuxt-link>
        </h6>
        <div class="d-flex flex-wrap flex-sm-nowrap">
          <p @click="clickPostLink" v-html="html" :class="{
            'mb-0': preview,
            'e-content p-name': detail
          }">
          </p>
          <div v-if="thumbs.length" class="mb-2 d-flex mr-auto ml-auto mr-sm-2 flex-wrap flex-sm-nowrap justify-content-sm-end">
            <thumb class="mx-1" :original="t.original" :thumb="t.thumb" :key="i" v-for="(t, i) in thumbs" />
          </div>
        </div>
        <footer v-if="!post.is_deleted && !preview">
          <div v-if="post.repost_of">
            <nuxt-link :to="`/@${post.user.username}`" class="text-muted">
              <i class="fa fa-retweet"></i>&nbsp; Reposted by @{{post.user.username}}
            </nuxt-link>
          </div>
          <ul class="list-inline">
            <li class="list-inline-item">
              <nuxt-link ref="link" :to="permalink" class="text-muted" v-bind:class="{ 'u-url': detail }" :title="absDate">
                <i class="fa fa-clock-o"></i>
                <time :class="{ 'dt-published': detail }" :datetime="absDate"> {{date}}</time>
              </nuxt-link>
            </li>
            <template v-if="post.reply_to">
              <li class="list-inline-item">
                <nuxt-link :to="reply_permalink" class="text-muted" v-bind:class="{ 'u-in-reply-to': detail }" title="In Reply To">
                  <i class="fa fa-comments"></i>
                </nuxt-link>
              </li>
            </template>
            <template v-else-if="post.counts.replies">
              <li class="list-inline-item">
                <nuxt-link :to="permalink" class="text-muted" title="Thread Starter">
                  <i class="fa fa-comments-o"></i>
                </nuxt-link>
              </li>
            </template>
            <template v-if="!viewOnly && user">
              <li class="list-inline-item reply">
                <a class="text-muted" href="#" @click.stop.prevent="replyModal">
                  <i class="fa fa-reply"></i>
                  Reply
                </a>
              </li>
            </template>
            <template v-if="!viewOnly && user">
              <li class="list-inline-item reply-all">
                <a class="text-muted" href="#" @click.stop.prevent="replyAllModal">
                  <i class="fa fa-reply-all"></i>
                  Reply All
                </a>
              </li>
            </template>
            <template v-if="!viewOnly && me">
              <li class="list-inline-item remove">
                <a class="text-muted" href="#" @click.stop.prevent="removeModal">
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
          <div class="d-flex align-items-center">
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
            <ul class="list-inline ml-3">
              <li class="list-inline-item" :key="user.id" v-for="user in reactionUsers">
                <nuxt-link :to="`/@${user.username}`" :title="`@${user.username}`">
                  <avatar :avatar="user.content.avatar_image" />
                </nuxt-link>
              </li>
            </ul>
          </div>
        </template>
      </div>
      <div class="ml-auto mt-1" v-if="!viewOnly && user && !post.is_deleted">
        <div class="btn-group-vertical" role="group">
          <action-button
            ref="favorite"
            :resource="`/posts/${mainPost.id}/bookmark`"
            :icon="['fa-star-o', 'fa-star']"
            v-model="mainPost.you_bookmarked"
          />
          <action-button
            v-if="!me"
            ref="repost"
            :resource="`/posts/${mainPost.id}/repost`"
            icon="fa-retweet"
            v-model="mainPost.you_reposted"
          />
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import moment from 'moment'
import emojione from 'emojione'
import ActionButton from '~/components/ActionButton'
import Avatar from '~/components/Avatar'
import Thumb from '~/components/Thumb'
import { mapState } from 'vuex'
import api from '~/plugins/api'
import cheerio from 'cheerio'
import bus from '~/assets/js/bus'
import focus from '~/assets/js/focus'

moment.updateLocale('en', {
  relativeTime: {
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh'
  }
})

export default {
  mixins: [focus],
  props: {
    data: Object,
    viewOnly: Boolean,
    detail: Boolean,
    preview: Boolean
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
    reactionUsers() {
      if (!this.detail) return []
      const users = this.mainPost.bookmarked_by.concat(
        this.mainPost.reposted_by
      )
      return (
        users
          // .slice(0, 10)
          .reduce((res, user) => {
            let exist = false
            for (let i = 0; res.length > i; i++) {
              if (res[i].id === user.id) {
                exist = true
                break
              }
            }
            if (!exist) {
              res.push(user)
            }
            return res
          }, [])
      )
    },
    html() {
      if (!this.post.is_deleted) {
        const $ = cheerio.load(this.mainPost.content.html)
        $('a').attr('target', '_new')
        $('span[data-mention-name]').replaceWith(function() {
          const name = $(this).data('mention-name')
          const text = $(this).text()
          return `<a href="/@${name}">${text}</a>`
        })
        $('span[data-tag-name]').replaceWith(function() {
          const tag = $(this).data('tag-name')
          const text = $(this).text()
          return `<a href="/tags/${tag}">${text}</a>`
        })
        return emojione.toImage($('span').html())
      } else {
        return '[Post deleted]'
      }
    },
    thumbs() {
      if (!this.mainPost.content) return []
      const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/
      const photos = []
      const linkPhotos = this.mainPost.content.entities.links
        .filter(link => imgExt.test(link.link))
        .map(link => {
          return {
            original: link.link,
            thumb: link.link
          }
        })
      Array.prototype.push.apply(photos, linkPhotos)
      if (this.mainPost.raw) {
        const embedPhotos = this.mainPost.raw
          .filter(r => {
            return r.type === 'io.pnut.core.oembed' && r.value.type === 'photo'
          })
          .map(r => {
            return {
              original: r.value.url,
              thumb: r.value.url
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
    permalink() {
      return `/@${this.mainPost.user.username}/posts/${this.mainPost.id}`
    },
    reply_permalink() {
      return `/posts/${this.mainPost.reply_to}`
    },
    ...mapState(['user'])
  },
  methods: {
    favoriteToggle() {
      this.$refs.favorite.click()
    },
    repostToggle() {
      if (!this.me) {
        this.$refs.repost.click()
      }
    },
    dateUpdate() {
      const now = moment()
      const postDate = moment(this.post.created_at)
      if (now.diff(postDate, 'day') >= 1) {
        const lastYear =
          now.toDate().getFullYear() - postDate.toDate().getFullYear()
        const format = lastYear ? 'D MMM YY' : 'D MMM'
        this.date = moment(this.post.created_at).format(format)
      } else {
        this.date = moment(this.post.created_at).fromNow(true)
      }
    },
    replyModal() {
      bus.$emit('showPostModal', this.mainPost)
    },
    replyAllModal() {
      bus.$emit('showPostModal', this.mainPost, true)
    },
    removeModal() {
      bus.$emit('showRemoveModal', this)
    },
    remove() {
      return api()
        .delete(`/posts/${this.post.id}`)
        .then(() => {
          this.$emit('remove')
        })
    },
    clickPostLink(e) {
      const a = e.target
      if (!a.href || !a.getAttribute('href').startsWith('/')) return
      e.preventDefault()
      this.$router.push(a.pathname)
    }
  },
  components: {
    ActionButton,
    Thumb,
    Avatar
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';

.media-body {
  word-break: break-word;
}

footer {
  font-size: 0.85rem;
}

.reply,
.reply-all,
.remove,
.source {
  opacity: 0;
  transition: all 0.2s ease;
}

.list-group-item {
  &:hover,
  &:focus {
    .reply,
    .reply-all,
    .remove,
    .source {
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

.deleted {
  opacity: 0.5;
}

.text-gray-dark {
  color: $gray;
}
</style>
