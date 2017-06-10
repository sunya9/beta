<template>
  <li @focus="focus" tabindex="-1" :id="`post-${post.id}`" class="list-group-item list-group-item-action">
    <div
      :class="{
        deleted: post.is_deleted
      }"
      class="media w-100 justify-content-start">
      <nuxt-link :to="`/@${mainPost.user.username}`" v-if="!preview">
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
        <div class="d-flex flex-wrap flex-sm-nowrap">
          <p @click="clickPostLink" v-html="html" :class="{
            'mb-0': preview
          }">
          </p>
          <div v-if="thumbs.length"
          class="mb-2 d-flex mr-auto ml-auto mr-sm-2 flex-wrap flex-sm-nowrap justify-content-sm-end">
            <thumb
              class="mx-1"
              :original="t.original"
              :thumb="t.thumb"
              :key="i"
              v-for="(t, i) in thumbs" />
          </div>
        </div>
        <footer v-if="!post.is_deleted && !preview">
          <div v-if="post.repost_of">
            <nuxt-link :to="`/@${post.user.username}`" class="text-muted">
              <i class="fa fa-retweet"></i>&nbsp;
              Reposted by @{{post.user.username}}
            </nuxt-link>
          </div>
          <ul class="list-inline">
            <li class="list-inline-item">
              <nuxt-link ref="link" :to="permalink" class="text-muted" :title="absDate">
                <i class="fa fa-clock-o"></i>
                {{date}}
              </nuxt-link>
            </li>
            <template v-if="!viewOnly">
              <li class="list-inline-item" v-show="post.reply_to">
                <nuxt-link :to="permalink" class="text-muted" :title="absDate">
                  <i class="fa fa-comments"></i>
                </nuxt-link>
              </li>
            </template>
            <template v-if="!viewOnly && user">
              <li class="list-inline-item reply">
                <a class="text-muted"
                  href="#"
                  @click.stop.prevent="replyModal"
                  >
                  <i class="fa fa-reply"></i>
                  Reply
                </a>
              </li>
            </template>
            <template v-if="!viewOnly && me">
              <li class="list-inline-item remove">
                <a class="text-muted"
                  href="#"
                  @click.stop.prevent="removeModal"
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
              <li
                class="list-inline-item"
                :key="user.id"
                v-for="user in reactionUsers">
                <nuxt-link :to="`/@${user.username}`" :title="`@${user.username}`">
                  <img
                    :src="user.content.avatar_image.link"
                    class="rounded-circle"
                    width="24"
                    height="24" />
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
            :initial-state="mainPost.you_bookmarked"
            />
          <action-button
            v-if="!me"
            ref="repost"
            :resource="`/posts/${mainPost.id}/repost`"
            icon="fa-retweet"
            :initial-state="mainPost.you_reposted"
            />
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import moment from 'moment'
import ActionButton from '~components/ActionButton'
import Thumb from '~components/Thumb'
import { mapState } from 'vuex'
import api from '~plugins/api'
import router from '~router'
import cheerio from 'cheerio'
import bus from '~assets/js/bus'
import focus from '~assets/js/focus'

moment.updateLocale('en', {
    relativeTime : {
      s: '%ds',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd'
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
  created() {
    setInterval(this.dateUpdate, 1000 * 30) // 30sec
    this.dateUpdate()
  },
  computed: {
    reactionUsers() {
      if(!this.detail) return []
      const users = this.mainPost.bookmarked_by.concat(this.mainPost.reposted_by)
      return users
        // .slice(0, 10)
        .reduce((res, user, i, users) => {
          let exist = false
          for(let i = 0; res.length > i; i++) {
            if(res[i].id === user.id) {
              exist = true
              break
            }
          }
          if(!exist) {
            res.push(user)
          }
          return res
        }, [])
    },
    html() {
      if(!this.post.is_deleted) {
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
      } else {
        return '[Post deleted]'
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
    permalink() {
      return `/@${this.mainPost.user.username}/posts/${this.mainPost.id}`
    },
    ...mapState(['user'])
  },
  methods: {
    favoriteToggle() {
      this.$refs.favorite.click()
    },
    repostToggle() {
      if(!this.me)
        thisjkkk.$refs.repost.click()
    },
    dateUpdate() {
      const now = moment()
      const postDate = moment(this.post.created_at)
      if(now.diff(postDate, 'month') >= 1) {
        const lastYear = now.toDate().getFullYear() - postDate.toDate().getFullYear()
        const format = lastYear ? 'D MMM YY' : 'D MMM'
        this.date = moment(this.post.created_at).format(format)
      } else {
        this.date = moment(this.post.created_at)
          .fromNow(true)
      }
    },
    replyModal() {
      bus.$emit('showPostModal', this.mainPost)
    },
    removeModal() {
      bus.$emit('showRemoveModal', this)
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
.deleted {
  opacity: .5;
}
</style>