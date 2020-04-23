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
          <no-ssr>
            <picker
              v-show="showEmojiPicker"
              ref="picker"
              v-on-click-outside="closeEmojiPalette"
              :background-image-fn="getSheet"
              set="twitter"
              class="emoji-picker"
              @select="addEmoji"
            />
          </no-ssr>
        </div>
        <div v-show="photos.length" class="form-group">
          <transition-group
            tag="div"
            name="photos"
            class="d-flex flex-wrap justify-content align-items-center"
          >
            <thumb
              v-for="(photo, i) in previewPhotos"
              :key="photo"
              :original="photo"
              :thumb="photo"
              removable
              class="mr-2"
              @remove="photos.splice(i, 1)"
            />
          </transition-group>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <strong class="text-muted" data-test-id="post-counter">
            {{ postCounter }}
          </strong>
          <div>
            <label
              v-show="!noPhoto"
              v-if="storage.available"
              :disabled="promise"
              class="btn btn-link text-dark add-photo mr-2"
            >
              <font-awesome-icon :icon="['far', 'image']" />
              <span class="d-none d-lg-inline ml-2">
                Photo
              </span>
              <input
                ref="file"
                type="file"
                multiple
                accept="image/*"
                style="display: none;"
                @change="fileChange"
              />
            </label>
            <button
              :class="{
                'text-dark': !hasPoll,
                'btn-primary': hasPoll,
              }"
              class="btn btn-link add-poll mr-2"
              type="button"
              @click="togglePoll"
            >
              <font-awesome-icon icon="chart-bar" />
              <span class="d-none d-lg-inline ml-2">
                Poll
              </span>
            </button>
            <button
              :class="{
                'text-dark': !hasSpoiler,
                'btn-primary': hasSpoiler,
              }"
              class="btn btn-link add-spoiler mr-2"
              type="button"
              @click="toggleSpoiler"
            >
              <font-awesome-icon :icon="['far', 'bell']" />
              <span class="d-none d-lg-inline ml-2">
                Spoiler
              </span>
            </button>
            <button
              :class="{
                'text-dark': !hasLongpost,
                'btn-primary': hasLongpost,
              }"
              class="btn btn-link add-longpost mr-2"
              type="button"
              @click="toggleLongpost"
            >
              <font-awesome-icon icon="plus" />
              <span class="d-none d-lg-inline ml-2">
                Long
              </span>
            </button>
            <button
              :class="{
                'text-dark': !nsfw,
                'btn-primary': nsfw,
              }"
              class="btn btn-link toggle-nsfw mr-2"
              type="button"
              @click="toggleNsfw"
            >
              <font-awesome-icon icon="exclamation-circle" />
              <span class="d-none d-lg-inline ml-2">
                NSFW
              </span>
            </button>
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
import querystring from 'querystring'
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { Cancelable } from 'lodash'
import { Token } from '~/models/token'
import { Post } from '~/models/post'
import { LongPost } from '~/models/raw/raw/long-post'
import { Poll } from '~/models/poll'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { User } from '~/models/user'
import {
  getMinimumPoll,
  getMinimumSpoiler,
  getMinimumLongPost,
} from '~/util/minimum-entities'
import bus from '~/assets/ts/bus'
import Thumb from '~/components/Thumb.vue'
import { Picker } from '~/plugins/emoji'
import InputPoll from '~/components/InputPoll.vue'
import InputSpoiler from '~/components/InputSpoiler.vue'
import InputLongpost from '~/components/InputLongpost.vue'
import textCount from '~/assets/ts/text-count'
import resettable from '~/assets/ts/resettable'
import { createVideoEmbedRaw } from '~/assets/ts/oembed'

@Component({
  components: {
    Thumb,
    Picker,
    InputPoll,
    InputSpoiler,
    InputLongpost,
  },
  mixins: [textCount, resettable],
})
export default class Composer extends Vue {
  textLength!: number
  debounceCalcTextLength!: (() => number) & Cancelable
  calcTextLength!: () => number

  @Prop({
    type: String,
    default: '',
  })
  initialText!: string

  @Prop({
    type: Boolean,
    default: false,
  })
  focus!: boolean

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

  promise: Promise<any> | null | boolean = null
  photos: File[] = []
  previewPhotos: string[] = []
  text: string = this.initialText
  replyStartPos = 0
  showEmojiPicker = false
  poll: Poll.PostBody | null = null

  spoiler: Spoiler.Value | null = null
  longpost: LongPost.Value | null = null
  nsfw = false

  get hasPoll(): boolean {
    return !!this.poll
  }

  get hasSpoiler(): boolean {
    return !!this.spoiler
  }

  get hasLongpost(): boolean {
    return !!this.longpost
  }

  get postCounter(): number {
    // TODO
    return 256 - (this as any).textLength
  }

  get textOverflow(): boolean {
    return this.postCounter < 0
  }

  get hasNoText(): boolean {
    // TODO
    return !(this as any).textLength
  }

  get disabled(): boolean {
    const sending = !!this.promise
    return !!(
      this.textOverflow ||
      this.hasNoText ||
      sending ||
      (this.poll && !this.availablePoll) ||
      (this.spoiler && !this.availableSpoiler) ||
      (this.longpost && !this.availableLongpost)
    )
  }

  get availablePoll(): boolean {
    return (
      !!this.poll &&
      this.poll.options &&
      this.poll.options.filter((option) => option.text).length >= 2
    )
  }

  get availableSpoiler(): boolean {
    return (
      !!this.spoiler &&
      !!this.spoiler.topic &&
      this.spoiler.topic.length > 0 &&
      this.spoiler.topic.length <= 128
    )
  }

  get availableLongpost(): boolean {
    return (
      !!this.longpost &&
      !!this.longpost.body &&
      this.longpost.body.length > 0 &&
      this.longpost.body.length <= 6144 &&
      (!this.longpost.title || this.longpost.title.length < 128)
    )
  }

  get hasPhotos(): boolean {
    return !!this.photos.length
  }

  get user(): User {
    return this.$store.getters.user
  }

  get storage(): Token.Storage {
    return this.$store.getters.storage
  }

  @Watch('photos')
  async onChangephotos() {
    const promisePhotos = this.photos.map((file) => {
      return new Promise<string>((resolve) => {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = (e) => {
          if (
            !e.target ||
            !e.target.result ||
            typeof e.target.result !== 'string'
          )
            throw new Error('Failed to load photo')
          resolve(e.target.result)
        }
      })
    })
    this.previewPhotos = await Promise.all(promisePhotos)
  }

  @Watch('replyTarget', { immediate: true })
  onChangereplyTarget(replyTarget: Post) {
    if (!replyTarget || !replyTarget.user || !replyTarget.content) return
    const notMe = this.user.username !== replyTarget.user.username
    if (notMe) {
      this.text = `@${replyTarget.user.username} `
    }

    this.replyStartPos = this.text.length

    const screenNames = replyTarget.content.entities.mentions.reduce<string[]>(
      (memo, mention) => {
        const key = mention.text.toLowerCase()
        const mentionTextWithAt = `@${mention.text}`
        const unique = !memo.includes(mentionTextWithAt)
        const notMe = key !== this.user.username.toLowerCase()
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

  created() {
    this.text = this.initialText
  }

  mounted() {
    if (this.focus) {
      this.setFocus()
    }
  }

  toggleNsfw() {
    this.nsfw = !this.nsfw
  }

  insertText(text: string) {
    const textarea = this.$refs.textarea as HTMLTextAreaElement
    const getSelection = document.getSelection()
    if (getSelection) {
      textarea.focus()

      const sel = (getSelection as any).createRange()
      sel.text = text
      textarea.focus()
    } else if (textarea.selectionStart || textarea.selectionStart === 0) {
      const startPos = textarea.selectionStart
      const endPos = textarea.selectionEnd

      const scrollTop = textarea.scrollTop
      const updateText =
        textarea.value.substring(0, startPos) +
        text +
        textarea.value.substring(endPos, textarea.value.length)
      this.text = updateText

      this.$nextTick(() => {
        textarea.focus()
        textarea.selectionStart = startPos + text.length
        textarea.selectionEnd = startPos + text.length
        textarea.scrollTop = scrollTop
      })
    } else {
      this.text = text
      textarea.focus()
    }
  }

  togglePoll() {
    this.poll = this.poll ? null : getMinimumPoll()
  }

  toggleSpoiler() {
    this.spoiler = this.spoiler ? null : getMinimumSpoiler()
  }

  toggleLongpost() {
    this.longpost = this.longpost ? null : getMinimumLongPost()
  }

  getSheet() {
    return require('emoji-datasource-twitter/img/twitter/sheets-128/64.png')
  }

  setFocus(force = false) {
    if (this.focus === false && !force) return
    // occur error if it not displayed like logged out
    // TODO

    const textarea = this.$refs.textarea as any
    // TODO
    // if (this.text.length === undefined) {
    //   this.text.length = this.replyStartPos
    // }
    if ('selectionStart' in textarea) {
      textarea.selectionStart = this.replyStartPos
      textarea.selectionEnd = this.text.length
    } else if (textarea.setSelectionRange) {
      textarea.setSelectionRange(this.replyStartPos, this.text.length)
    } else if (textarea.createTextRange) {
      const range = textarea.createTextRange()
      range.collapse(true)
      range.moveEnd('character', this.text.length)
      range.moveStart('character', this.replyStartPos)
      range.select()
    }
    textarea.focus()
  }

  async uploadPoll() {
    if (!this.poll) return
    this.poll.options = this.poll.options.filter((option) => option.text)
    const res = await this.$axios.$post('/polls', {
      ...this.poll,
      prompt: this.poll.prompt || this.text,
    })
    return res
  }

  async submit() {
    if (this.promise || this.textOverflow || this.hasNoText) return false
    const option: Post.PostBody = {
      text: this.text,
      raw: [],
    }
    try {
      if (this.hasPhotos) {
        this.promise = true
        const { raws } = await this.$interactors.uploadPhotos.run({
          photos: this.photos,
        })
        this.promise = false
        option.raw.push(...raws)
      }
      if (this.replyTarget) {
        option.reply_to = this.replyTarget.id
      }
      if (this.nsfw) {
        option.is_nsfw = true
      }
      if (this.spoiler && option.raw) {
        option.raw.push({
          type: 'shawn.spoiler',
          value: {
            topic: this.spoiler.topic,
          },
        })
      }
      if (this.longpost && option.raw) {
        option.raw.push({
          type: 'nl.chimpnut.blog.post',
          value: this.longpost,
        })
      }
      if (this.hasPoll && option.raw) {
        const {
          data: { id: poll_id, poll_token },
        } = await this.uploadPoll()
        option.raw.push({
          type: 'io.pnut.core.poll-notice',
          value: {
            '+io.pnut.core.poll': {
              poll_token,
              poll_id,
            },
          },
        })
      }
      if (option.raw) {
        option.raw.push(...createVideoEmbedRaw(option.text))
      }
    } catch (e) {
      console.error(e)

      this.$toast.error(e.message)
      return
    }
    const method = this.editPost ? '$put' : '$post'
    const endpoint = this.editPost ? `/posts/${this.editPost.id}` : '/posts'
    const queries = {
      include_raw: 1,
    }
    this.promise = this.$axios[method](
      `${endpoint}?${querystring.stringify(queries)}`,
      option
    )
    await this.$nextTick()
    return this.promise
      .then((res) => {
        this.promise = null
        bus.$emit('post', res.data)
        this.$emit('post', res.data)
        this.text = ''
        this.photos = []
        this.poll = null
        this.spoiler = null
        this.longpost = null
        this.nsfw = false
      })
      .finally(() => {
        this.promise = null
        this.$toast.success('Posted!')
      })
  }

  fileChange(e: Event) {
    if (!e.target) return
    const target = e.target as HTMLInputElement
    if (!target || !target.files || !target.files.length) return
    ;[].unshift()
    const newPhotos = Array.from(target.files)
    this.photos = [...this.photos, ...newPhotos] as File[]
    // reset file form for detecting changes(if there `sn't below code, not working when is selected same file)
    ;(this.$refs.file as HTMLInputElement).value = ''
  }

  // TODO
  addEmoji(emoji: any) {
    this.insertText(emoji.native)
    this.closeEmojiPalette()
  }

  async toggleEmojiPalette() {
    this.showEmojiPicker = !this.showEmojiPicker
    if (!this.showEmojiPicker) return
    await this.$nextTick()
    const input = (this.$refs.picker as Vue).$el.querySelector('input')
    if (!input) return
    input.focus()
  }

  closeEmojiPalette() {
    this.showEmojiPicker = false
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

.photos-enter-active,
.photos-leave-to {
  transition: all 0.5s ease;
}

.photos-enter,
.photos-leave-to {
  opacity: 0;
  transform: scale(0);
}

.photos-move {
  transition: transform 0.5s;
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

.add-photo {
  cursor: pointer;
  margin-bottom: 0;
}
</style>
