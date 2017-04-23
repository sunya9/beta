<template>
  <li @focus="focus" tabindex="-1" class="list-group-item list-group-item-action">
    <div class="media w-100">
      <nuxt-link :to="`/@${user.username}`">
        <img :src="user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <div class="d-flex justify-content-between align-items-baseline">
          <h6 class="mb-1">
            <nuxt-link :to="`/@${user.username}`">
            {{user.username}}
            </nuxt-link>
            <span class="text-muted">{{user.name}}</span>
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
import FollowButton from '~components/FollowButton'
import cheerio from 'cheerio'
import router from '~router'
import focus from '~assets/js/focus'

export default {
  mixins: [focus],
  props: ['data'],
  computed: {
    html() {
      if(this.user.content && this.user.content.html) {
        const $ = cheerio.load(this.user.content.html)
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
    user() {
      return this.data
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
  }
}
</script>