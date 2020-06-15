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
          />
          <emoji-picker @select="addEmoji" />
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
            <add-file v-model="fileWrappers" :disabled="promise" class="mr-2" />
            <toggle-poll v-model="poll" :disabled="promise" class="mr-2" />
            <toggle-spoiler
              v-model="spoiler"
              :disabled="promise"
              class="mr-2"
            />
            <toggle-longpost
              v-model="longpost"
              :disabled="promise"
              class="mr-2"
            />
            <toggle-nsfw v-model="nsfw" :disabled="promise" class="mr-2" />
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
import InputPoll from '~/components/InputPoll.vue'
import InputSpoiler from '~/components/InputSpoiler.vue'
import InputLongpost from '~/components/InputLongpost.vue'
import resettable from '~/assets/ts/resettable'
import ToggleNsfw from '~/components/atoms/ToggleNsfw.vue'
import ToggleLongpost from '~/components/atoms/ToggleLongpost.vue'
import ToggleSpoiler from '~/components/atoms/ToggleSpoiler.vue'
import TogglePoll from '~/components/atoms/TogglePoll.vue'
import FilePreviewList from '~/components/organisms/FilePreviewList.vue'
import EmojiPicker from '~/components/molecules/EmojiPicker.vue'
import AddFile from '~/components/atoms/AddFile.vue'
@Component({
  components: {
    Thumb,
    InputPoll,
    InputSpoiler,
    InputLongpost,
    ToggleNsfw,
    ToggleLongpost,
    FilePreviewList,
    ToggleSpoiler,
    TogglePoll,
    EmojiPicker,
    AddFile,
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
        replyTo: this.replyTarget?.id,
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

.textarea {
  padding-right: 1.7rem;
  min-height: 7rem;
}
</style>
