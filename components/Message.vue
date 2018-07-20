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
          }">
          <entity-text :content="message.content" :spoilers=spoilers>
            [Message deleted]
          </entity-text>
        </p>
        <div v-if="thumbs.length" class="flex-shrink-1 mb-2 d-flex mr-auto ml-auto mr-md-2 flex-wrap flex-lg-nowrap justify-content-md-end">
          <thumb class="mx-1 mb-1 mb-lg-0" :original="t.original" :thumb="t.thumb" :key="i" v-for="(t, i) in thumbs" />
        </div>
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
import Avatar from '~/components/Avatar'
import Thumb from '~/components/Thumb'
import EntityText from '~/components/EntityText'
import listItem from '~/assets/js/list-item'
import { getImageURLs, getSpoilers } from '~/assets/js/util'

export default {
  mixins: [listItem],
  dateKey: 'message.created_at',
  props: ['data'],
  computed: {
    me() {
      return this.user && this.user.id === this.message.user.id
    },
    message() {
      return this.data
    },
    thumbs() {
      return getImageURLs(this.data)
    },
    spoilers() {
      return getSpoilers(this.data)
    },
    ...mapState(['user'])
  },
  methods: {
    clickMessage() {}
  },
  components: {
    Avatar,
    EntityText,
    Thumb
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
