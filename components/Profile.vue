<template>
  <div class="card profile">
    <img :src="profile.content.cover_image.link" alt="" class="img-fluid card-img-top">
    <div class="card-block pt-3">
      <div class="flex-column d-flex flex-sm-row align-items-sm-start">
        <div class="d-flex justify-content-sm-between w-100 flex-column flex-sm-row">
          <div class="d-flex flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-center justify-content-sm-start">
            <a :href="profile.content.avatar_image.link">
              <img :src="profile.content.avatar_image.link"
                alt="" class="rounded-circle mr-sm-3 negative"
                width="96" height="96" :title="profile.id">
            </a>
            <h3 class="card-title w-100" :title="profile.id">
              <div class="d-flex flex-column flex-sm-row flex-row-sm flex-wrap flex-lg-nowrap align-items-center align-items-sm-baseline">
                <span>
                  @{{profile.username}}
                </span>
                <small class="ml-sm-2 d-block d-sm-inline text-muted">{{profile.name}}</small>
              </div>
            </h3>
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
      <p class="card-text w-100 mt-3 mt-sm-0" @click="clickPostLink" v-html="html"></p>
    </div>
    <div class="card-block d-flex justify-content-between justify-content-md-end">
      <span class="card-link" to="follows" append>{{profile.counts.posts}} Posts</span>
      <nuxt-link class="card-link" to="follows" append>{{profile.counts.following}} Follows</nuxt-link>
      <nuxt-link class="card-link" to="followers" append>{{profile.counts.followers}} Followers</nuxt-link>
      <nuxt-link class="card-link" to="starred" append>{{profile.counts.bookmarks}} Starred</nuxt-link>
    </div>
  </div>
</template>

<script>
import FollowButton from '~components/FollowButton'
import cheerio from 'cheerio'
import { mapState } from 'vuex'
import router from '~router'

export default {
  props: ['profile'],
  computed: {
    ...mapState(['user']),
    relation() {
      return this.profile.follows_you ? 'Follows you' : ''
    },
    html() {
      if(this.profile.content.html) {
        const $ = cheerio.load(this.profile.content.html)
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
    }
  },
  methods: {
    clickPostLink (e) {
      const a = e.target
      if (!a.href || !a.getAttribute('href').startsWith('/')) return
      e.preventDefault()
      router.push(a.pathname)
    }
  },
  components: {
    FollowButton
  },
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.negative {
  margin-top: -48px;
}

.profile {
  @include no-gutter-xs
}
</style>
