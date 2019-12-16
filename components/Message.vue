<template>
  <div>
    <div v-if="firstUnreadMessage" class="matching-hr">
      <hr>
      <div>
        <span class="text-muted">
          Previously read
        </span>
      </div>
    </div>
    <div
      :class="{
        'flex-row-reverse': me
      }"
      class="media mb-2"
    >
      <nuxt-link
        :to="`/@${messageUser.username}`"
        :class="{ 'disabled-link': !messageUser.id }"
        class="mt-4"
      >
        <avatar
          :avatar="messageUser.content.avatar_image"
          :class="{
            'mr-4': !me,
            'ml-4': me
          }"
          :alt="messageUser.username"
          class="d-flex"
          size="32"
          max-size="32"
        />
      </nuxt-link>
      <div class="media-body">
        <h6
          :class="{
            'text-right': me
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
            'mr-5': !me && !displayFullView
          }"
          class="d-flex flex-row"
        >
          <div
            :class="{
              'order-2': me
            }"
          >
            <div
              :class="{
                me: me,
                other: !me
              }"
              class="py-2 px-3 mb-1 balloon"
            >
              <entity-text :content="message.content" :spoiler="spoiler">
                <em>
                  [Message deleted{{
                    message.deleted_by ? ' by moderator' : ''
                  }}]
                </em>
              </entity-text>
              <div
                v-if="thumbs.length"
                class="flex-shrink-1 mb-2 d-flex mr-auto ml-auto mr-md-2 flex-wrap flex-lg-nowrap justify-content-md-end"
                style="margin-top:.8em"
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
              'ml-2': !me
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
import Vue, { PropOptions } from 'vue'
import Avatar from '~/components/Avatar.vue'
import Thumb from '~/components/Thumb.vue'
import EntityText from '~/components/EntityText.vue'
import listItem from '~/assets/ts/list-item'
import {
  getImageURLs,
  getAudio,
  getSpoiler,
  deletedUser,
  ImageForView,
  AudioForView,
  MinimumUser
} from '~/assets/ts/util'
import { User } from '~/models/user'
import { Message } from '~/models/message'
import { Spoiler } from '~/models/raw/raw/spoiler'

export default Vue.extend({
  components: {
    Avatar,
    EntityText,
    Thumb
  },
  mixins: [listItem('message.created_at')],
  props: {
    displayFullView: {
      type: Boolean,
      default: false
    },
    message: {
      type: Object,
      required: true
    } as PropOptions<Message>,
    isModerator: {
      type: Boolean,
      default: false
    },
    channelType: {
      type: String,
      default: ''
    },
    lastReadMessageId: {
      type: String,
      default: ''
    }
  },
  computed: {
    me(): boolean {
      return (
        !!this.user && this.messageUser && this.user.id === this.messageUser.id
      )
    },
    messageUser(): MinimumUser {
      return this.message.user || deletedUser
    },
    canDelete(): boolean {
      return (
        !this.message.is_deleted &&
        (this.me ||
          (this.channelType !== 'io.pnut.core.pm' && this.isModerator))
      )
    },
    firstUnreadMessage(): boolean {
      return this.message.id === this.lastReadMessageId
    },
    thumbs(): ImageForView[] {
      return getImageURLs(this.message)
    },
    clips(): AudioForView[] | void {
      return getAudio(this.message)
    },
    spoiler(): Spoiler.Value | void {
      return getSpoiler(this.message)
    },
    user(): User | null {
      return this.$store.state.user
    }
  },
  methods: {
    removeModal() {
      this.$modal.show('message-remove-modal', this)
    },
    async remove() {
      if (!this.message) return
      const { data: message } = await this.$axios.$delete(
        `/channels/${this.message.channel_id}/messages/${this.message.id}`
      )
      this.$toast.success('Deleted Message!')
      this.$emit('update:message', message)
    }
  }
})
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
  .message:focus & {
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
</style>
