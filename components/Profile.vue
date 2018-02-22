<template>
  <div class="card profile">
    <img :src="profile.content.cover_image.link" alt="" :width="profile.content.cover_image.width" :height="profile.content.cover_image.height || 500" @load="loaded = true" :class="{
            'min-card-image-height': !loaded
          }" class="img-fluid card-img-top">
    <div class="card-body pt-3">
      <div class="flex-column d-flex flex-sm-row align-items-sm-start">
        <div class="d-flex justify-content-sm-between w-100 flex-column flex-sm-row">
          <div class="d-flex flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-center justify-content-sm-start">
            <a :href="profile.content.avatar_image.link">
              <img :src="profile.content.avatar_image.link + '?w=140'" alt="" :class="'mr-sm-3 negative ' + avatarClass" width="120" height="120" :title="profile.id">
            </a>
            <div class="w-100">
              <h3 class="card-title mb-1" :title="profile.id">
                <span class="d-flex flex-column flex-sm-row flex-row-sm flex-wrap flex-lg-nowrap align-items-center align-items-sm-baseline">
                  <span>
                    @{{profile.username}}
                  </span>
                  <small class="ml-sm-2 d-block d-sm-inline text-muted">{{profile.name}}</small>
                </span>
              </h3>
              <p v-if="profile.verified" class="text-center text-md-left">
                <a :href="profile.verified.link">{{profile.verified.domain}}</a>
              </p>
            </div>
          </div>
          <div v-if="user && profile.id !== user.id" class="text-center">
            <follow-button :initial-state="profile.you_follow" :user-id="profile.id" class="mb-2" />
            <div class="text-muted">
              <small>
                {{relation}}
              </small>
            </div>
          </div>
        </div>
      </div>
      <p class="description card-text w-100 mt-3 mt-sm-0" @click="clickPostLink" v-html="html"></p>
    </div>
    <div class="card-body d-flex justify-content-between justify-content-md-end">
      <span class="card-link" append>{{profile.counts.posts}} Posts</span>
      <nuxt-link v-if="user" class="card-link" to="follows" append>{{profile.counts.following}} Follows</nuxt-link>
      <span v-if="!user" class="card-link" append>{{profile.counts.following}} Follows</span>
      <nuxt-link v-if="user" class="card-link" to="followers" append>{{profile.counts.followers}} Followers</nuxt-link>
      <span v-if="!user" class="card-link" append>{{profile.counts.followers}} Followers</span>
      <nuxt-link v-if="user" class="card-link" to="starred" append>{{profile.counts.bookmarks}} Starred</nuxt-link>
      <span v-if="!user" class="card-link" append>{{profile.counts.bookmarks}} Starred</span>
      <a class="card-link" :href="'https://api.pnut.io/v0/feed/rss/users/' + profile.id + '/posts'"><i class="fa fa-rss-square" aria-hidden="true"></i> RSS</a>
    </div>
  </div>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import cheerio from 'cheerio'
import emojione from 'emojione'
import { mapState } from 'vuex'

export default {
  props: ['profile'],
  data() {
    return {
      loaded: false,
      avatarClass: 'rounded-circle'
    }
  },
  mounted() {
    this.avatarClass = (localStorage.getItem('square_avatars') === 'true') ? '' : 'rounded-circle'
  },
  computed: {
    ...mapState(['user']),
    relation() {
      return this.profile.follows_you ? 'Follows you' : ''
    },
    html() {
      if (this.profile.content.html) {
        const $ = cheerio.load(this.profile.content.html)
        $('a').attr('target', '_new')
        $('span[data-mention-name]')
          .replaceWith(function() {
            const name = $(this).data('mention-name')
            const text = $(this).text()
            return `<a href="/@${name}">${text}</a>`
          })
        $('span[data-tag-name]')
          .replaceWith(function() {
            const tag = $(this).data('tag-name')
            const text = $(this).text()
            return `<a href="/tags/${tag}">${text}</a>`
          })
        return emojione.toImage($('span').html())
      }
    }
  },
  methods: {
    clickPostLink(e) {
      const a = e.target
      if (!a.href || !a.getAttribute('href').startsWith('/')) return
      e.preventDefault()
      this.$router.push(a.pathname)
    }
  },
  components: {
    FollowButton
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.negative {
  margin-top: -48px;
  background-color: white;
}

.profile {
  @include no-gutter-xs
}

.min-card-image-height {
  min-height: 200px;
}

.description {
  white-space: pre-wrap;
}
</style>
