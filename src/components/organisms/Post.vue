<template>
  <div
    :class="{
      deleted: post.is_deleted,
      'h-entry': detail,
    }"
    class="media w-100 justify-content-start"
  >
    <a
      v-if="detail && mainPost.user"
      v-show="false"
      :href="
        mainPost.user.verified
          ? mainPost.user.verified.link
          : `/@${mainPost.user.username}`
      "
      rel="author"
      class="p-author h-card"
    >
      <avatar
        v-if="mainPost.user.content"
        :avatar="mainPost.user.content.avatar_image"
        :alt="mainPost.user.name || mainPost.user.username"
        class="d-flex mr-3 iconSize u-photo"
        size="64"
        max-size="64"
      />
    </a>
    <div v-if="!mainPost.user">
      <img
        src="~assets/img/beta.svg"
        width="64"
        height="64"
        alt="deleted user's avatar"
        class="d-flex mr-3 iconSize u-photo"
      />
    </div>
    <nuxt-link v-else-if="!preview" :to="`/@${mainPost.user.username}`">
      <user-popper :user="mainPost.user">
        <avatar
          v-if="mainPost.user.content"
          :avatar="mainPost.user.content.avatar_image"
          :alt="mainPost.user.username"
          class="d-flex mr-3 iconSize"
          size="64"
          max-size="64"
          :user="mainPost.user"
        />
      </user-popper>
    </nuxt-link>
    <div class="media-body">
      <h6 class="mt-1">
        <nuxt-link
          v-if="mainPost.user"
          :to="`/@${mainPost.user.username}`"
          class="text-gray-dark"
        >
          {{ mainPost.user.username }}
          <emojify
            v-if="mainPost.user.name"
            :text="mainPost.user.name"
            element="small"
            class="text-muted"
          />
        </nuxt-link>
        <span v-else class="text-gray-dark">Deleted user</span>
      </h6>
      <nsfw :include-nsfw="mainPost.is_nsfw">
        <div class="d-flex flex-wrap flex-md-nowrap">
          <div class="flex-grow-1 w-100">
            <button
              v-if="spoiler && !showSpoiler"
              class="btn btn-outline-primary mb-2"
              type="button"
              @click="toggleSpoiler"
            >
              <span class="d-sm-inline ml-2">
                Show Spoiler:
                <emojify :text="spoiler.topic" />
              </span>
            </button>
            <template v-else>
              <p
                :class="{
                  'e-content p-name': detail,
                }"
              >
                <entity-text
                  :content="mainPost.content"
                  :deleted="post.is_deleted"
                >
                  <em>[Post deleted]</em>
                </entity-text>
              </p>
              <div v-if="!post.is_deleted && longpost" class="my-2">
                <button
                  :class="{
                    'btn-link': showLongpost,
                    'btn-outline-primary': !showLongpost,
                  }"
                  class="btn mb-2"
                  data-test-collapse-button
                  type="button"
                  @click="toggleLongpost"
                >
                  <font-awesome-icon
                    :icon="!showLongpost ? 'plus' : 'minus'"
                    aria-hidden="true"
                  />
                  <span v-if="!showLongpost">Expand Post</span>
                  <span v-else>Collapse Post</span>
                </button>
                <div v-if="showLongpost" class="mt-2 longpost">
                  <emojify
                    v-if="longpost.title"
                    :text="longpost.title"
                    element="h5"
                  />
                  <emojify :text="longpost.body" element="p" />
                </div>
              </div>
            </template>
          </div>
          <div
            v-if="thumbs.length"
            class="flex-shrink-1 mb-2 d-flex mr-auto ml-auto mr-md-2 flex-wrap flex-lg-nowrap justify-content-md-end"
          >
            <thumb
              v-for="(t, i) in thumbs"
              :key="i"
              :original="t.original"
              :thumb="t.thumb"
              :original-width="t.width"
              :original-height="t.height"
              class="mx-1 mb-1 mb-lg-0"
            />
          </div>
          <div
            v-if="clips"
            class="flex-shrink-1 mb-2 d-flex mr-auto ml-auto mr-md-2 flex-wrap flex-lg-nowrap justify-content-md-end"
          >
            <sound
              v-for="(t, i) in clips"
              :key="i"
              :url="t.url"
              :title="t.title"
            />
          </div>
        </div>
        <div v-if="oembedVideos">
          <div v-for="(video, i) in oembedVideos" :key="i" class="card mb-2">
            <div class="card-body text-center">
              <div class="video-wrapper">
                <iframe
                  v-if="video.type === 'iframe'"
                  :width="video.width"
                  :height="video.height"
                  frameborder="0"
                  :src="video.url"
                  class="video-iframe"
                >
                  Does not support iframe.
                </iframe>
                <video
                  v-else
                  controls
                  :width="video.width"
                  :height="video.height"
                  class="video-iframe"
                >
                  <source :src="video.url" />
                  Does not support video.
                </video>
              </div>
            </div>
          </div>
        </div>
        <div v-if="pollNotice" class="card mb-3">
          <div class="card-body">
            <poll-notice :poll-notice-value="pollNotice.value" />
          </div>
        </div>
        <p v-if="channelInvite">
          <nuxt-link
            :to="`/channels/${channelInvite.channel_id}`"
            class="btn btn-outline-primary"
          >
            Go to
            <i>{{ channelInvite.display_name }}</i>
          </nuxt-link>
        </p>
      </nsfw>

      <footer v-if="!post.is_deleted && !preview">
        <div v-if="post.repost_of && post.user">
          <nuxt-link :to="`/@${post.user.username}`" class="text-muted">
            <font-awesome-icon icon="retweet" class="mr-1" />
            <span>Reposted by @{{ post.user.username }}</span>
          </nuxt-link>
        </div>
        <ul class="list-inline">
          <li class="list-inline-item">
            <nuxt-link
              ref="link"
              :to="permalink"
              :class="{ 'u-url': detail }"
              :title="absDate"
              class="text-muted"
            >
              <font-awesome-icon :icon="['far', 'clock']" class="mr-1" />
              <time :class="{ 'dt-published': detail }" :datetime="absDate">
                {{ detail ? absDate : date }}
              </time>
            </nuxt-link>
          </li>
          <template v-if="mainPost.is_revised">
            <li class="list-inline-item revised">
              <template v-if="mainPost.revision">
                <font-awesome-icon :icon="['far', 'edit']" class="mr-1" />
                Original
              </template>
              <template v-else>
                <nuxt-link
                  :to="revisions_permalink"
                  class="text-muted"
                  title="Revised Post"
                >
                  <font-awesome-icon icon="edit" class="mr-1" />
                  <span>Revised</span>
                </nuxt-link>
              </template>
            </li>
          </template>
          <li
            v-if="!viewOnly && me && !disableEdit && !revised"
            class="list-inline-item edit"
          >
            <a href="#" class="text-muted" @click.prevent="editPost">
              <font-awesome-icon icon="edit" class="mr-1" />
              <span>Edit</span>
            </a>
          </li>
          <template v-if="post.reply_to">
            <li class="list-inline-item">
              <nuxt-link
                :to="reply_permalink"
                :class="{ 'u-in-reply-to': detail }"
                class="text-muted"
                title="In Reply To"
              >
                <font-awesome-icon icon="comments" class="mr-1" />
              </nuxt-link>
            </li>
          </template>
          <template v-else-if="post.counts && post.counts.replies">
            <li class="list-inline-item">
              <nuxt-link
                :to="permalink"
                class="text-muted"
                title="Thread Starter"
              >
                <font-awesome-icon :icon="['far', 'comments']" />
              </nuxt-link>
            </li>
          </template>
          <template v-if="!viewOnly && user">
            <li class="list-inline-item reply">
              <a class="text-muted" href="#" @click.prevent="replyModal">
                <font-awesome-icon icon="reply" class="mr-1" />
                <span>Reply</span>
              </a>
            </li>
          </template>
          <template v-if="!viewOnly && me">
            <li class="list-inline-item remove">
              <a class="text-muted" href="#" @click.stop.prevent="removeModal">
                <font-awesome-icon icon="trash" class="mr-1" />
                <span>Remove</span>
              </a>
            </li>
          </template>
          <template v-if="!viewOnly || !user">
            <li class="list-inline-item source">
              <a :href="post.source.link" class="text-muted" target="_new">
                <font-awesome-icon icon="paper-plane" class="mr-1" />
                <span>via {{ mainPost.source.name }}</span>
              </a>
            </li>
          </template>
          <template v-if="crosspost">
            <li class="list-inline-item crosspost-url">
              <a :href="crosspost" class="text-muted" target="_new">
                <font-awesome-icon icon="random" class="mr-1" />
                <span>Crosspost</span>
              </a>
            </li>
          </template>
        </ul>
      </footer>
      <template v-if="detail">
        <hr />
        <div class="d-flex align-items-center">
          <ul v-if="post.counts" class="list-inline">
            <li class="list-inline-item">
              <div class="count">
                {{ post.counts.replies }}
              </div>
              <small class="text-muted">replies</small>
            </li>
            <li class="list-inline-item">
              <div class="count">
                {{ post.counts.reposts }}
              </div>
              <small class="text-muted">reposts</small>
            </li>
            <li class="list-inline-item">
              <div class="count">
                {{ post.counts.bookmarks }}
              </div>
              <small class="text-muted">stars</small>
            </li>
          </ul>
          <ul class="list-inline ml-3">
            <li
              v-for="reactionUser in reactionUsers"
              :key="reactionUser.id"
              class="list-inline-item"
            >
              <user-popper v-if="reactionUser.content" :user="reactionUser">
                <nuxt-link
                  :to="`/@${reactionUser.username}`"
                  :title="`@${reactionUser.username}`"
                >
                  <avatar :avatar="reactionUser.content.avatar_image" />
                </nuxt-link>
              </user-popper>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <div v-if="!viewOnly && user && !post.is_deleted" class="ml-auto mt-1">
      <div class="btn-group-vertical" role="group">
        <action-button
          ref="favorite"
          v-model="mainPost.you_bookmarked"
          :resource="`/posts/${mainPost.id}/bookmark`"
          :icon="[
            ['far', 'star'],
            ['fas', 'star'],
          ]"
        />
        <action-button
          v-if="!me"
          ref="repost"
          v-model="mainPost.you_reposted"
          :resource="`/posts/${mainPost.id}/repost`"
          icon="retweet"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import ActionButton from '~/components/atoms/ActionButton.vue'
import Avatar from '~/components/atoms/Avatar.vue'
import UserPopper from '~/components/molecules/UserPopper.vue'
import Thumb from '~/components/molecules/Thumb.vue'
import Sound from '~/components/molecules/Sound.vue'
import PollNoticeView from '~/components/organisms/PollNotice.vue'
import EntityText from '~/components/atoms/EntityText.vue'
import Nsfw from '~/components/organisms/Nsfw.vue'
import { Post } from '~/entity/post'
import { PollNotice } from '~/entity/raw/raw/poll-notice'
import { User } from '~/entity/user'

import {
  getImageURLs,
  getAudio,
  getOembedVideo,
  getVideoSrcFromHtml,
  determineVideoType,
  AudioForView,
  ImageForView,
} from '~/assets/ts/util'
import listItem from '~/assets/ts/list-item'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import { Crosspost } from '~/entity/raw/raw/crosspost'
import { LongPost } from '~/entity/raw/raw/long-post'
import { ChannelInvite } from '~/entity/raw/raw/channel-invite'

const FIVE_MINUTES = 1000 * 60 * 5 // 5 minutes

@Component({
  components: {
    ActionButton,
    Thumb,
    Sound,
    Avatar,
    EntityText,
    PollNotice: PollNoticeView,
    Nsfw,
    UserPopper,
  },
})
export default class PostView extends Mixins(listItem('post.created_at')) {
  @Prop({
    type: Object,
    required: true,
  })
  post!: Post

  @Prop({
    type: Boolean,
    default: false,
  })
  viewOnly!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  detail!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  preview!: boolean

  timer: number | null = null
  disableEdit = true
  showSpoiler = false
  showLongpost = false

  get revised(): boolean {
    return this.mainPost.is_revised
  }

  get pollNotice() {
    return PollNotice.findPollNotice(this.mainPost.raw)
  }

  get reactionUsers(): User[] {
    if (!this.detail || this.post.is_deleted) return []
    const bookmarkedBy = this.mainPost.bookmarked_by || []
    const repostedBy = this.mainPost.reposted_by || []
    const users = [...bookmarkedBy, ...repostedBy]
    // TODO: merge
    return (
      users
        // .slice(0, 10)
        .reduce<User[]>((res, user) => {
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
  }

  // TODO
  get oembedVideos(): any {
    return getOembedVideo(this.mainPost).map((value) => {
      const url = getVideoSrcFromHtml(value.html) || value.embeddable_url
      const type = determineVideoType(url!)
      const { width, height } = value
      return {
        url,
        type,
        width,
        height,
      }
    })
  }

  get thumbs(): ImageForView[] {
    return getImageURLs(this.mainPost)
  }

  get clips(): AudioForView[] | void {
    return getAudio(this.mainPost)
  }

  get crosspost() {
    return Crosspost.getCrosspostLink(this.mainPost)
  }

  get spoiler() {
    return Spoiler.getSpoiler(this.mainPost)
  }

  get longpost() {
    return LongPost.getLongpost(this.mainPost)
  }

  get channelInvite() {
    return ChannelInvite.getChannelInvite(this.mainPost)
  }

  get me(): boolean {
    return !!this.user && !!this.post.user && this.user.id === this.post.user.id
  }

  get mainPost(): Post {
    return this.post.repost_of || this.post
  }

  get permalink(): string {
    const user = this.mainPost.user
    return user
      ? `/@${user.username}/posts/${this.mainPost.id}`
      : `/posts/${this.mainPost.id}`
  }

  get reply_permalink(): string {
    return `/posts/${this.mainPost.reply_to}`
  }

  get revisions_permalink(): string {
    return `/posts/${this.mainPost.id}/revisions`
  }

  get user(): User | null {
    return this.$accessor.user
  }

  readonly shortcutMap: Readonly<Record<string, () => void>> = {
    r: () => this.replyModal(),
    s: () => this.favoriteToggle(),
    p: () => this.repostToggle(),
    enter: () => this.goPost(),
    del: () => this.removeModal(),
  }

  handleKeyEvent(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    if (!(e instanceof KeyboardEvent)) return
    const { key } = e
    this.shortcutMap[key]?.()
  }

  mounted() {
    this.$el.addEventListener('keydown', this.handleKeyEvent)
    if (!this.me) return
    this.setupReviseButtonTimer()
  }

  setupReviseButtonTimer() {
    // TODO
    const diff = Date.now() - new Date(this.itemDate).getTime()
    const over5minutes = diff > FIVE_MINUTES
    if (over5minutes) return
    const remainMilliSeconds = FIVE_MINUTES - diff
    this.disableEdit = false
    this.timer = window.setTimeout(
      () => (this.disableEdit = true),
      remainMilliSeconds
    )
  }

  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.handleKeyEvent)
    if (!this.timer) return
    clearTimeout(this.timer)
  }

  toggleSpoiler() {
    this.showSpoiler = !this.showSpoiler
  }

  toggleLongpost() {
    this.showLongpost = !this.showLongpost
  }

  async editPost() {
    if (this.mainPost.is_deleted) return
    try {
      const newPost = await this.$modal.show('post-modal', this.mainPost, {
        edit: true,
      })
      this.$emit('update:post', newPost)
    } catch (e) {}
  }

  replyModal() {
    if (this.mainPost.is_deleted) return
    this.$modal.show('post-modal', this.mainPost)
  }

  goPost() {
    this.$router.push(this.permalink)
  }

  favoriteToggle() {
    if (this.mainPost.is_deleted) return // TODO
    this.$refs.favorite.toggle()
  }

  repostToggle() {
    if (this.me || this.mainPost.is_deleted) return // TODO
    this.$refs.repost.toggle()
  }

  $refs!: {
    favorite: ActionButton
    repost: ActionButton
  }

  async removeModal() {
    if (!this.me || this.mainPost.is_deleted) return
    try {
      await this.$modal.show('remove-modal', this.post)
      this.remove()
    } catch (e) {}
  }

  async remove() {
    const { data: post } = await this.$axios.$delete(`/posts/${this.post.id}`)
    this.$toast.success('Deleted Post!')
    this.$emit('update:post', post)
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
  hyphens: auto;
}

footer {
  font-size: 0.85rem;
}

.media {
  .reply,
  .remove,
  .source,
  .edit,
  .crosspost-url {
    opacity: 0;
    transition: all 0.2s ease;
  }
  &:hover,
  &:focus {
    .reply,
    .remove,
    .source,
    .edit,
    .crosspost-url {
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
.longpost {
  white-space: pre-wrap;
}
.video-wrapper {
  // 16:9
  padding-bottom: 56.25%;
  position: relative;
}
.video-iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
