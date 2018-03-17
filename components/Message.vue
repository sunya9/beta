<template>
  <li class="media mb-4"
    :class="{
      'flex-row-reverse': me
    }"
    >
    <nuxt-link :to="`/@${message.user.username}`" class="mt-4">
      <avatar :avatar="message.user.content.avatar_image"
        class="d-flex"
        :class="{
          'mr-4': !me,
          'ml-4': me
        }"
        :alt="message.user.username"
        size="32"
        max-size="32"
      />
    </nuxt-link>
    <div class="media-body"
      >
      <h6 class="mb-2"
      :class="{
        'text-right': me
      }">
        <nuxt-link :to="`/@${message.user.username}`">
          {{message.user.username}}
          <small class="text-muted">
            {{message.user.name}}
          </small>
        </nuxt-link>
      </h6>
      <div class="d-flex flex-row"
      :class="{
        'ml-5 justify-content-end': me,
        'mr-5': !me
      }">
        <p
          @click="clickMessage"
          class="balloon py-2 px-3 mb-0"
          :class="{
            'order-2 me': me,
            other: !me
          }"
          v-html="html">
        </p>
        <footer
          class="align-self-end"
          :class="{
            'order-1 mr-2': me,
            'ml-2': !me
          }">
          <span class="text-muted text-nowrap" :title="absDate">
            {{date}}
          </span>
        </footer>
      </div>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import emojione from 'emojione'
import cheerio from 'cheerio'
import Avatar from '~/components/Avatar'

export default {
  props: ['message'],
  data() {
    return {
      date: null,
      timer: null
    }
  },
  computed: {
    html() {
      if (!this.message.is_deleted) {
        const $ = cheerio.load(this.message.content.html, {
          decodeEntities: false
        })
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
    me() {
      return this.user && this.user.id === this.message.user.id
    },
    absDate() {
      return moment(this.message.created_at).format()
    },
    ...mapState(['user'])
  },
  created() {
    this.dateUpdate()
  },
  mounted() {
    this.timer = setInterval(this.dateUpdate, 1000 * 30) // 30sec
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    clickMessage() {},

    // TODO: refactoring
    dateUpdate() {
      const now = moment()
      const postDate = moment(this.message.created_at)
      if (now.diff(postDate, 'day') >= 1) {
        const lastYear =
          now.toDate().getFullYear() - postDate.toDate().getFullYear()
        const format = lastYear ? 'D MMM YY' : 'D MMM'
        this.date = moment(this.message.created_at).format(format)
      } else {
        this.date = moment(this.message.created_at).fromNow(true)
      }
    }
  },
  components: {
    Avatar
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/adn_base_variables';

.balloon {
  position: relative;
  background: $grayLighter;
  border-radius: 2px;
  word-break: break-word;
  &.me,
  &.other {
    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 7px;
      border: 10px solid transparent;
    }
    &::before {
      z-index: 2;
    }
    &::after {
      z-index: 1;
    }
  }
  &.me::before {
    right: -20px;
    border-left-color: $grayLighter;
  }
  &.other::before {
    left: -20px;
    border-right-color: $grayLighter;
  }
}
</style>
