<template>
  <li @focus="focus" tabindex="-1" class="list-group-item list-group-item-action">
    <div class="media w-100">
      <nuxt-link :to="`/@${user.username}`">
        <img :src="user.content.avatar_image.link + '?w=120'" alt="" :class="'d-flex mr-3 ' + avatarClass" width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <div class="d-flex justify-content-between align-items-baseline mb-2">
          <h6 class="d-inline-flex flex-wrap flex-row">
            <nuxt-link :to="`/@${user.username}`">
              {{user.username}}
            </nuxt-link>
            <span class="ml-1 text-muted">{{user.name}}</span>
            <span class="ml-1 badge badge-secondary text-uppercase">{{relation}}</span>
          </h6>
          <div>
            <follow-button :initial-state="user.you_follow" :user-id="user.id" />
          </div>
        </div>
        <p @click="clickPostLink" v-html="html"></p>
      </div>
    </div>
  </li>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import cheerio from 'cheerio'
import emojione from 'emojione'
import focus from '~/assets/js/focus'

export default {
  mixins: [focus],
  props: ['data'],
  data() {
    return {
      avatarClass: this.$store.state.square_avatars ? '' : 'rounded-circle'
    }
  },
  computed: {
    relation() {
      return this.data.follows_you ? 'Follows you' : ''
    },
    html() {
      if (this.user.content && this.user.content.html) {
        const $ = cheerio.load(this.user.content.html)
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
    },
    user() {
      return this.data
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

<style scoped>
.media-body {
  word-break: break-word;
}
</style>
