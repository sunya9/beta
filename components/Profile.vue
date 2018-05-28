<template>
	<div class="card profile" v-if="profile.content">
		<img :src="profile.content.cover_image.link" alt="" :width="profile.content.cover_image.width" :height="profile.content.cover_image.height" @load="loaded = true" v-if="profile.content.cover_image" :class="{
        show: loaded
      }" :style="{
        'min-height': `${headerHeight}px`
      }" class="img-fluid card-img-top">
		<div class="card-body pt-3 h-card">
			<div class="flex-column d-flex flex-sm-row align-items-sm-start">
				<div class="d-flex justify-content-sm-between w-100 flex-column flex-sm-row">
					<div class="d-flex flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-center justify-content-sm-start">
						<a v-if="!profile.verified" style="display:none" :href="`/@${profile.username}`" rel="me" class="u-url">profile.username</a>
						<thumb :original="profile.content.avatar_image.link" no-border :width="0" :height="0" :zooming-options="{
                customSize: {
                  width: profile.content.avatar_image.width,
                  height: profile.content.avatar_image.height
                }
              }">
							<avatar :avatar="profile.content.avatar_image" class="mr-sm-3 negative u-photo" :size="96" :max-size="96" :alt="profile.username" :title="profile.id" />
						</thumb>
						<div class="w-100">
							<h3 class="card-title mb-1" :title="profile.id">
								<span class="d-flex flex-column flex-sm-row flex-row-sm flex-wrap flex-lg-nowrap align-items-center align-items-sm-baseline">
									<span class="p-nickname" v-bind:class="{'p-name': !profile.name}">
										@{{profile.username}}
									</span>
									<small v-if="profile.name" class="ml-sm-2 d-block d-sm-inline text-muted p-name">
										{{profile.name}}
										<span v-if="profile.badge" class="ml-1">
											<i class="fa fa-shield"></i>
										</span>
									</small>
									<mute-button :profile.sync="profile" class="ml-2" v-if="profile.you_muted" />
								</span>
							</h3>
							<p v-if="profile.verified" class="text-center text-md-left" id="profile-domain">
								<a :href="profile.verified.link" class="u-url" rel="me">{{profile.verified.domain}}</a>
								<i class="ml-1 fa fa-check-circle-o text-success"></i>
							</p>
						</div>
					</div>
					<div v-if="!me" class="text-center">
						<follow-button :profile.sync="profile" class="mb-2" id="profile-follow-button" />
						<div class="text-muted" id="profile-relation">
							<small>
								{{relation}}
							</small>
						</div>
					</div>
				</div>
			</div>
			<p v-if="profile.content.text" class="description card-text w-100 mt-3 mt-sm-0 p-note">
				<entity-text :content="profile.content" />
			</p>
		</div>
		<div class="card-body d-flex justify-content-between justify-content-md-end" id="profile-counts">
			<span class="card-link" append>{{profile.counts.posts}} Posts</span>
			<nuxt-link :tag="user ? 'a' : 'span'" class="card-link" to="follows" append>{{profile.counts.following}} Follows</nuxt-link>
			<nuxt-link :tag="user ? 'a' : 'span'" class="card-link" to="followers" append>{{profile.counts.followers}} Followers</nuxt-link>
			<nuxt-link :tag="user ? 'a' : 'span'" class="card-link" to="starred" append>{{profile.counts.bookmarks}} Starred</nuxt-link>
			<div class="dropdown card-link">
				<a class="dropdown-toggle" id="profile-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">
					<i class="fa fa-ellipsis-h"></i>
				</a>
				<div class="dropdown-menu dropdown-menu-right" aria-labelledby="profile-dropdown">
					<nuxt-link v-if="me" to="/polls" class="dropdown-item">Your polls</nuxt-link>
					<base-block-button v-if="!me" :profile.sync="profile">
						<a slot-scope="{ toggleBlock }" class="dropdown-item" href="#" @click.prevent="toggleBlock">{{blockText}}</a>
					</base-block-button>
					<base-mute-button :profile.sync="profile" v-if="!me && !profile.you_blocked">
						<a slot-scope="{ toggleMute }" class="dropdown-item" href="#" @click.prevent="toggleMute">{{muteText}}</a>
					</base-mute-button>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" :href="'https://api.pnut.io/v0/feed/rss/users/' + profile.id + '/posts'">
						<i class="fa fa-rss-square" aria-hidden="true"></i> RSS</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import Thumb from '~/components/Thumb'
import Avatar from '~/components/Avatar'
import { mapState } from 'vuex'
import EntityText from '~/components/EntityText'
import BaseMuteButton from '~/components/BaseMuteButton'
import BaseBlockButton from '~/components/BaseBlockButton'
import MuteButton from '~/components/MuteButton'

export default {
  props: {
    initialProfile: {
      required: true,
      type: Object
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
  data() {
    return {
      headerHeight: 0,
      loaded: false,
      profile: this.initialProfile
    }
  },
  mounted() {
    const { width } = this.$el.getBoundingClientRect()
    // 2 === side border width
    const ratio = (width - 2) / this.profile.content.cover_image.width
    this.headerHeight = this.profile.content.cover_image.height * ratio
  },
  computed: {
    ...mapState(['user']),
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
  components: {
    FollowButton,
    Thumb,
    Avatar,
    EntityText,
    BaseMuteButton,
    BaseBlockButton,
    MuteButton
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
