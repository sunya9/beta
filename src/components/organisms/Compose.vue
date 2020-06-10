<template>
  <div v-if="user" :class="{ 'mb-4 compose': !compact }">
    <div :class="{ 'border-0': compact }" class="card">
      <form
        :class="{ 'p-0': compact }"
        class="card-body"
        @submit.prevent="submit"
      >
        <div class="form-group relative">
          <textarea
            ref="textarea"
            v-model="text"
            :disabled="!!promise"
            data-test-id="compose"
            class="form-control textarea"
            @keydown.ctrl.enter="submit"
            @keydown.meta.enter="submit"
            @submit="submit"
          />
          <a
            href="#"
            class="open-emoji-picker text-dark"
            @click.prevent.stop="toggleEmojiPalette"
          >
            <font-awesome-icon :icon="['far', 'smile']" size="lg" />
          </a>
          <client-only>
            <picker
              v-show="showEmojiPicker"
              ref="picker"
              v-on-click-outside="closeEmojiPalette"
              :background-image-fn="getSheet"
              set="twitter"
              class="emoji-picker"
              @select="addEmoji"
            />
          </client-only>
        </div>
        <file-preview-list
          :file-wrappers="fileWrappers"
          @remove="fileWrappers.splice($event, 1)"
        />
        <div class="d-flex justify-content-between align-items-center">
          <strong class="text-muted" data-test-id="post-counter">
            {{ postCounter }}
          </strong>
          <div>
            <label
              v-show="!noPhoto"
              v-if="storage.available"
              :disabled="promise"
              class="btn btn-link text-dark mb-0 mr-2"
            >
              <font-awesome-icon :icon="['far', 'image']" />
              <span class="d-none d-lg-inline ml-2">
                File
              </span>
              <input
                ref="file"
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                style="display: none;"
                @change="fileChange"
              />
            </label>
            <toggle-poll v-model="poll" class="mr-2" />
            <toggle-spoiler v-model="spoiler" class="mr-2" />
            <toggle-longpost v-model="longpost" class="mr-2" />
            <toggle-nsfw v-model="nsfw" class="mr-2" />
            <button
              :disabled="disabled"
              type="submit"
              class="ml-1 btn btn-primary text-uppercase"
            >
              <span v-show="promise">
                <font-awesome-icon icon="sync" spin fixed-width class="mr-2" />
              </span>
              <span>Post</span>
            </button>
          </div>
        </div>
        <input-poll v-if="poll" class="mt-3" @update:poll="(p) => (poll = p)" />
        <input-spoiler
          v-if="spoiler"
          class="mt-3"
          @update:spoiler="(p) => (spoiler = p)"
        />
        <input-longpost
          v-if="longpost"
          class="mt-3"
          @update:longpost="(p) => (longpost = p)"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator'
import { Mixins } from 'vue-property-decorator'
import { createCompose } from './ComposeAbstract'
import { Post } from '~/models/post'
import bus from '~/assets/ts/bus'
import Thumb from '~/components/Thumb.vue'
import { Picker } from '~/plugins/emoji'
import InputPoll from '~/components/InputPoll.vue'
import InputSpoiler from '~/components/InputSpoiler.vue'
import InputLongpost from '~/components/InputLongpost.vue'
import resettable from '~/assets/ts/resettable'
import ToggleNsfw from '~/components/atoms/ToggleNsfw.vue'
import ToggleLongpost from '~/components/atoms/ToggleLongpost.vue'
import ToggleSpoiler from '~/components/atoms/ToggleSpoiler.vue'
import TogglePoll from '~/components/atoms/TogglePoll.vue'
import FilePreviewList from '~/components/organisms/FilePreviewList.vue'

@Component({
  components: {
    Thumb,
    Picker,
    InputPoll,
    InputSpoiler,
    InputLongpost,
    ToggleNsfw,
    ToggleLongpost,
    FilePreviewList,
    ToggleSpoiler,
    TogglePoll,
  },
})
export default class Compose extends Mixins(
  resettable,
  createCompose({ textCount: 256 })
) {
  @Prop({
    type: Object,
    default: null,
  })
  replyTarget!: Post | null

  @Prop({
    type: Boolean,

    default: false,
  })
  replyAll!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  noPhoto!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  compact!: boolean

  @Prop({
    type: Object,
    default: null,
  })
  editPost!: Post | null

  @Watch('replyTarget', { immediate: true })
  onChangereplyTarget(replyTarget: Post) {
    if (!replyTarget || !replyTarget.user || !replyTarget.content) return
    const notMe = this.user?.username !== replyTarget.user.username
    if (notMe) {
      this.text = `@${replyTarget.user.username} `
    }

    this.replyStartPos = this.text.length

    const screenNames = replyTarget.content.entities.mentions.reduce<string[]>(
      (memo, mention) => {
        const key = mention.text.toLowerCase()
        const mentionTextWithAt = `@${mention.text}`
        const unique = !memo.includes(mentionTextWithAt)
        const notMe = key !== this.user?.username.toLowerCase()
        if (unique && notMe) {
          memo.push(mentionTextWithAt)
        }
        return memo
      },
      []
    )
    if (screenNames.length > 0) {
      this.text += `${screenNames.join(' ')} `
    }
  }

  @Watch('editPost')
  onChangeeditPost(editPost: Post) {
    if (!editPost || !editPost.content) return
    this.text = editPost ? editPost.content.text : ''
  }

  createPost() {
    return this.$interactors.createPost
      .run({
        text: this.text,
        isNsfw: this.nsfw,
        reply: this.replyTarget,
        longpost: this.longpost,
        spoiler: this.spoiler,
        files: this.files,
        pollRequest: this.poll,
      })
      .then((res) => {
        bus.$emit('post', res.res.data)
        this.$emit('post', res.res.data)
        this.initialize()
      })
      .finally(() => {
        this.promise = null
        this.$toast.success('Posted!')
      })
  }

  updatePost(postId: string) {
    return this.$interactors.updatePost
      .run({
        text: this.text,
        isNsfw: this.nsfw,
        postId,
      })
      .then((res) => {
        bus.$emit('post', res.res.data)
        this.$emit('post', res.res.data)
        this.initialize()
      })
      .finally(() => {
        this.promise = null
        this.$toast.success('Updated!')
      })
  }

  get cannotSubmit() {
    return this.promise || this.textOverflow || this.hasNoText
  }

  submit() {
    if (this.cannotSubmit) return
    try {
      if (this.editPost) {
        this.promise = this.updatePost(this.editPost.id)
      } else {
        this.promise = this.createPost()
      }
    } catch (e) {
      console.error(e)
      this.$toast.error(e.message)
    } finally {
      this.promise = null
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/breakpoints';
@import '~assets/css/mixin';

.compose {
  @include no-gutter-xs;
}

@include media-breakpoint-down(xs) {
  .textarea {
    font-size: 16px;
  }
}

.relative {
  position: relative;
}

.open-emoji-picker {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.textarea {
  padding-right: 1.7rem;
  min-height: 7rem;
}

.emoji-picker {
  position: absolute;
  right: 0;
  top: 2rem;
  z-index: 3;
}
</style>
