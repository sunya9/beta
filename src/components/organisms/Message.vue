<template>
  <div>
    <div v-if="firstUnreadMessage" class="matching-hr">
      <hr />
      <div>
        <span class="text-muted">Previously read</span>
      </div>
    </div>
    <div
      :class="{ 'flex-row-reverse': me, 'is-deleted': !message.content }"
      class="media mb-2"
    >
      <nuxt-link
        :to="`/@${messageUser.username}`"
        :class="{ 'disabled-link': !messageUser.id }"
        class="mt-4"
      >
        <user-popper :user="messageUser">
          <avatar
            :avatar="authorAvatar"
            :class="{
              'mr-4': !me,
              'ml-4': me,
            }"
            :alt="messageUser.username"
            class="d-flex"
            size="32"
            max-size="32"
          />
        </user-popper>
      </nuxt-link>
      <div class="media-body">
        <h6
          :class="{
            'text-right': me,
          }"
          class="mb-2"
        >
          <nuxt-link
            :to="`/@${messageUser.username}`"
            :class="{ 'disabled-link': !messageUser.id }"
          >
            {{ messageUser.username }}
            <emojify
              :text="messageUser.name"
              element="small"
              class="text-muted"
            />
          </nuxt-link>
        </h6>
        <div
          :class="{
            'justify-content-end': me,
            'ml-5': me && !displayFullView,
            'mr-5': !me && !displayFullView,
          }"
          class="d-flex flex-row"
        >
          <div
            :class="{
              'order-2': me,
            }"
          >
            <div
              :class="{
                me: me,
                other: !me,
              }"
              class="py-2 px-3 mb-1 balloon"
            >
              <entity-text
                v-if="message.content"
                :content="message.content"
                :spoiler="spoiler"
              >
                <em>
                  [Message deleted{{
                    message.deleted_by ? ' by moderator' : ''
                  }}]
                </em>
              </entity-text>
              <span v-else>Deleted</span>
              <div
                v-if="thumbs.length"
                class="flex-shrink-1 mb-2 d-flex mr-auto ml-auto mr-md-2 flex-wrap flex-lg-nowrap justify-content-md-end"
                style="margin-top: 0.8em;"
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
                v-if="clips.length"
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
            <footer>
              <ul class="list-inline">
                <li class="list-inline-item">
                  <a
                    v-if="canDelete"
                    class="text-muted"
                    href="#"
                    @click.stop.prevent="removeModal"
                  >
                    <font-awesome-icon icon="trash" />
                    Remove
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    :href="message.source.link"
                    class="text-muted"
                    target="_new"
                  >
                    <font-awesome-icon icon="paper-plane" />
                    via {{ message.source.name }}
                  </a>
                </li>
              </ul>
            </footer>
          </div>
          <div
            :class="{
              'order-1 mr-2': me,
              'ml-2': !me,
            }"
            class="align-self-end date-pos"
          >
            <span :title="absDate" class="text-muted text-nowrap">
              {{ date }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import Avatar from '~/components/atoms/Avatar.vue'
import UserPopper from '~/components/molecules/UserPopper.vue'
import Thumb from '~/components/molecules/Thumb.vue'
import EntityText from '~/components/atoms/EntityText.vue'
import listItem from '~/assets/ts/list-item'
import {
  getImageURLs,
  getAudio,
  deletedUser,
  ImageForView,
  AudioForView,
  MinimumUser,
} from '~/assets/ts/util'
import { User } from '~/entity/user'
import { Message } from '~/entity/message'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import Sound from '~/components/molecules/Sound.vue'

@Component({
  components: {
    Avatar,
    EntityText,
    Thumb,
    UserPopper,
    Sound,
  },
})
export default class MessageView extends Mixins(
  listItem('message.created_at')
) {
  @Prop({
    type: Boolean,
    default: false,
  })
  displayFullView!: boolean

  @Prop({
    type: Object,
    required: true,
  })
  message!: Message

  @Prop({
    type: Boolean,
    default: false,
  })
  isModerator!: boolean

  @Prop({
    type: String,
    default: '',
  })
  channelType!: string

  @Prop({
    type: String,
    default: '',
  })
  lastReadMessageId!: string

  get me(): boolean {
    return this.user?.id === this.messageUser?.id
  }

  get messageUser(): MinimumUser {
    return this.message.user || deletedUser
  }

  get canDelete(): boolean {
    return (
      !this.message.is_deleted &&
      (this.me || (this.channelType !== 'io.pnut.core.pm' && this.isModerator))
    )
  }

  get firstUnreadMessage(): boolean {
    return this.message.id === this.lastReadMessageId
  }

  get thumbs(): ImageForView[] {
    return getImageURLs(this.message)
  }

  get clips(): AudioForView[] {
    return getAudio(this.message) || []
  }

  get spoiler() {
    return Spoiler.getSpoiler(this.message)
  }

  get user(): User | null {
    return this.$accessor.user
  }

  get authorAvatar() {
    return this.messageUser.content?.avatar_image
  }

  removeModal() {
    this.$modal.show('message-remove-modal', this)
  }

  async remove() {
    if (!this.message) return
    const { data: message } = await this.$axios.$delete(
      `/channels/${this.message.channel_id}/messages/${this.message.id}`
    )
    this.$toast.success('Deleted Message!')
    this.$emit('update:message', message)
  }

  readonly shortcutMap: Readonly<Record<string, () => void>> = {
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
  }

  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.handleKeyEvent)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/adn_base_variables';

.message {
  footer {
    transition: opacity 0.2s linear;
    visibility: hidden;
    opacity: 0;
  }
  &:focus,
  &:hover {
    & footer {
      opacity: 1;
      visibility: visible;
    }
  }
}

.balloon {
  $focus-bg-color: $warningBackground;
  position: relative;
  background: $grayLighter;
  border-radius: 2px;
  word-break: break-word;
  :focus & {
    background: $focus-bg-color;
    &.other::before {
      border-right-color: $focus-bg-color;
    }
    &.me::before {
      border-left-color: $focus-bg-color;
    }
  }
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
.date-pos {
  position: relative;
  top: -1.8rem;
}
.is-deleted {
  opacity: 0.5;
}
</style>
