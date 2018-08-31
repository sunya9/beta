<template>
  <div
    v-if="profile.content"
    class="card profile">
    <img
      v-if="profile.content.cover_image"
      :src="profile.content.cover_image.link"
      :width="profile.content.cover_image.width"
      :height="profile.content.cover_image.height"
      :class="{
        show: loaded
      }"
      :style="{
        'min-height': `${headerHeight}px`
      }"
      alt=""
      class="img-fluid card-img-top"
      @load="loaded = true">
    <div class="card-body pt-3 h-card">
      <div class="flex-column d-flex flex-sm-row align-items-sm-start">
        <div class="d-flex justify-content-sm-between w-100 flex-column flex-sm-row">
          <div class="d-flex flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-center justify-content-sm-start">
            <a
              v-if="!profile.verified"
              :href="`/@${profile.username}`"
              style="display:none"
              rel="me"
              class="u-url">profile.username</a>
            <thumb
              :original="profile.content.avatar_image.link"
              :width="0"
              :height="0"
              :zooming-options="{
                customSize: {
                  width: profile.content.avatar_image.width,
                  height: profile.content.avatar_image.height
                }
              }"
              no-border>
              <avatar
                :avatar="profile.content.avatar_image"
                :size="96"
                :max-size="96"
                :alt="profile.username"
                :title="profile.id"
                class="mr-sm-3 negative u-photo" />
            </thumb>
            <div class="w-100">
              <h3
                :title="profile.id"
                class="card-title mb-1">
                <span class="d-flex flex-column flex-sm-row flex-row-sm flex-wrap flex-lg-nowrap align-items-center align-items-sm-baseline">
                  <span
                    :class="{'p-name': !profile.name}"
                    class="p-nickname">
                    @{{ profile.username }}
                  </span>
                  <small
                    v-if="profile.name"
                    class="ml-sm-2 d-block d-sm-inline text-muted p-name">
                    {{ profile.name }}
                  </small>
                  <small
                    v-if="profile.badge"
                    class="ml-sm-2 d-block d-sm-inline text-muted ml-1">
                    <i class="fa fa-shield"/>
                  </small>
                  <small
                    v-if="profile.type != 'human'"
                    class="ml-sm-2 d-block d-sm-inline text-muted ml-1">
                    ({{ profile.type }})
                  </small>
                  <mute-button
                    v-if="profile.you_muted"
                    :profile.sync="profile"
                    class="ml-2" />
                </span>
              </h3>
              <p
                v-if="profile.verified"
                id="profile-domain"
                class="text-center text-md-left">
                <a
                  :href="profile.verified.link"
                  class="u-url"
                  rel="me">{{ profile.verified.domain }}</a>
                <i class="ml-1 fa fa-check-circle-o text-success"/>
              </p>
            </div>
          </div>
          <div
            v-if="!me"
            class="text-center">
            <follow-button
              id="profile-follow-button"
              :profile.sync="profile"
              class="mb-2" />
            <div
              id="profile-relation"
              class="text-muted">
              <small>
                {{ relation }}
              </small>
            </div>
          </div>
        </div>
      </div>
      <p
        v-if="profile.content.text"
        class="description card-text w-100 mt-3 mt-sm-0 p-note">
        <entity-text :content="profile.content" />
      </p>
    </div>
    <div
      id="profile-counts"
      class="card-body d-flex justify-content-between justify-content-md-end">
      <span
        class="card-link"
        append>{{ profile.counts.posts }} Posts</span>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        class="card-link"
        to="follows"
        append>{{ profile.counts.following }} Follows</nuxt-link>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        class="card-link"
        to="followers"
        append>{{ profile.counts.followers }} Followers</nuxt-link>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        class="card-link"
        to="starred"
        append>{{ profile.counts.bookmarks }} Starred</nuxt-link>
      <div class="dropdown card-link">
        <a
          id="profile-dropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          href="#">
          <i class="fa fa-ellipsis-h"/>
        </a>
        <div
          class="dropdown-menu dropdown-menu-right"
          aria-labelledby="profile-dropdown">
          <nuxt-link
            v-if="me"
            to="/polls"
            class="dropdown-item">Your polls</nuxt-link>
          <base-block-button
            v-if="user && !me"
            :profile.sync="profile">
            <a
              slot-scope="{ toggleBlock }"
              class="dropdown-item"
              href="#"
              @click.prevent="toggleBlock">{{ blockText }}</a>
          </base-block-button>
          <base-mute-button
            v-if="user && !me && !profile.you_blocked"
            :profile.sync="profile">
            <a
              slot-scope="{ toggleMute }"
              class="dropdown-item"
              href="#"
              @click.prevent="toggleMute">{{ muteText }}</a>
          </base-mute-button>
          <div class="dropdown-divider"/>
          <a
            :href="'https://api.pnut.io/v0/feed/rss/users/' + profile.id + '/posts'"
            class="dropdown-item">
            <i
              class="fa fa-rss-square"
              aria-hidden="true"/> RSS</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import Thumb from '~/components/Thumb'
import Avatar from '~/components/Avatar'
import { mapGetters } from 'vuex'
import EntityText from '~/components/EntityText'
import BaseMuteButton from '~/components/BaseMuteButton'
import BaseBlockButton from '~/components/BaseBlockButton'
import MuteButton from '~/components/MuteButton'

export default {
  components: {
    FollowButton,
    Thumb,
    Avatar,
    EntityText,
    BaseMuteButton,
    BaseBlockButton,
    MuteButton
  },
  props: {
    initialProfile: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      headerHeight: 0,
      loaded: false,
      profile: this.initialProfile
    }
  },
  computed: {
    ...mapGetters(['user']),
    relation() {
      return this.profile.follows_you ? 'Follows you' : ''
    },
    me() {
      return this.user && this.profile.id == this.user.id
    },
    atname() {
      return `@${this.profile.username}`
    },
    blockText() {
      const prefix = this.profile.you_blocked ? 'Unblock' : 'Block'
      return `${prefix} ${this.atname}`
    },
    muteText() {
      const prefix = this.profile.you_muted ? 'Unmute' : 'Mute'
      return `${prefix} ${this.atname}`
    }
  },
  watch: {
    profile: {
      handler(profile) {
        this.$emit('update:initialProfile', profile)
      },
      deep: true
    }
  },
  mounted() {
    const { width } = this.$el.getBoundingClientRect()
    // 2 === side border width
    const ratio = (width - 2) / this.profile.content.cover_image.width
    this.headerHeight = this.profile.content.cover_image.height * ratio
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
  @include no-gutter-xs;
}

.min-card-image-height {
  min-height: 200px;
}

.description {
  white-space: pre-wrap;
}
.card-img-top {
  transition: all 0.5s ease;
  opacity: 0;
}
.show {
  opacity: 1;
}
.dropdown-divider {
  margin: 0;
}
</style>
