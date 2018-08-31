<template>
  <div
    v-if="user"
    :class="{'mb-4 compose': !compact}">
    <div
      :class="{'border-0': compact}"
      class="card">
      <form
        :class="{'p-0': compact}"
        class="card-body"
        @submit.prevent="submit">
        <div class="form-group relative">
          <textarea
            ref="textarea"
            v-model="text"
            :disabled="!!promise"
            class="form-control textarea"
            @keydown.ctrl.enter="submit"
            @keydown.meta.enter="submit"
            @submit="submit" />
          <a
            href="#"
            class="open-emoji-picker text-dark"
            @click.prevent.stop="toggleEmojiPalette">
            <i class="fa fa-lg fa-smile-o"/>
          </a>
          <no-ssr>
            <picker
              v-on-click-outside="closeEmojiPalette"
              v-show="showEmojiPicker"
              ref="picker"
              :background-image-fn="getSheet"
              set="twitter"
              class="emoji-picker"
              @select="addEmoji" />
          </no-ssr>
        </div>
        <div
          v-show="photos.length"
          class="form-group">
          <transition-group
            tag="div"
            name="photos"
            class="d-flex flex-wrap justify-content align-items-center">
            <thumb
              v-for="(photo, i) in previewPhotos"
              :key="photo.data"
              :original="photo.data"
              :thumb="photo.data"
              removable
              class="mr-2"
              @remove="photos.splice(i, 1)" />
          </transition-group>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <strong
            class="text-muted"
            data-test-id="post-counter">{{ postCounter }}</strong>
          <div>
            <label
              v-show="!noPhoto"
              v-if="storage.available"
              :disabled="promise"
              class="btn btn-link text-dark add-photo mr-2">
              <i class="fa fa-picture-o"/>
              <span class="d-none d-sm-inline ml-2">Photo</span>
              <input
                ref="file"
                type="file"
                multiple
                accept="image/*"
                style="display: none"
                @change="fileChange">
            </label>
            <button
              :class="{
                'text-dark': !hasPoll,
                'btn-primary': hasPoll
              }"
              class="btn btn-link add-poll mr-2"
              type="button"
              @click="togglePoll">
              <i class="fa fa-bar-chart"/>
              <span class="d-none d-sm-inline ml-2">Poll</span>
            </button>
            <button
              :class="{
                'text-dark': !hasSpoiler,
                'btn-primary': hasSpoiler
              }"
              class="btn btn-link add-spoiler mr-2"
              type="button"
              @click="toggleSpoiler">
              <i class="fa fa-bell-o"/>
              <span class="d-none d-sm-inline ml-2">Spoiler</span>
            </button>
            <button
              :class="{
                'text-dark': !hasLongpost,
                'btn-primary': hasLongpost
              }"
              class="btn btn-link add-longpost mr-2"
              type="button"
              @click="toggleLongpost">
              <i class="fa fa-plus"/>
              <span class="d-none d-sm-inline ml-2">Long</span>
            </button>
            <button
              :disabled="disabled"
              type="submit"
              class="ml-1 btn btn-primary text-uppercase">
              <span v-show="promise">
                <i class="fa fa-refresh fa-spin fa-fw"/>&nbsp;
              </span>
              Post
            </button>
          </div>
        </div>
        <input-poll
          v-if="poll"
          class="mt-3"
          @update:poll="p => poll = p" />
        <input-spoiler
          v-if="spoiler"
          class="mt-3"
          @update:spoiler="p => spoiler = p" />
        <input-longpost
          v-if="longpost"
          class="mt-3"
          @update:longpost="p => longpost = p" />
      </form>
    </div>
  </div>
</template>

<script>
import Post from '~/components/Post'
import bus from '~/assets/js/bus'
import { mapGetters } from 'vuex'
import Thumb from '~/components/Thumb'
import { Picker } from '~/plugins/emoji'
import emojiSource from 'emoji-datasource-twitter/img/twitter/sheets/64.png'
import InputPoll from '~/components/InputPoll'
import InputSpoiler from '~/components/InputSpoiler'
import InputLongpost from '~/components/InputLongpost'
import textCount from '~/assets/js/text-count'

export default {
  components: {
    Post,
    Thumb,
    Picker,
    InputPoll,
    InputSpoiler,
    InputLongpost
  },
  mixins: [textCount],
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: {
      type: null,
      default: null
    },
    replyTarget: {
      type: Object,
      default: null
    },
    replyAll: {
      type: Boolean,
      default: false
    },
    noPhoto: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      promise: null,
      photos: [],
      previewPhotos: [],
      text: this.initialText,
      replyStartPos: 0,
      showEmojiPicker: false,
      poll: null,
      spoiler: null,
      longpost: null
    }
  },
  computed: {
    hasPoll() {
      return this.poll
    },
    hasSpoiler() {
      return this.spoiler
    },
    hasLongpost() {
      return this.longpost
    },
    postCounter() {
      return 256 - this.textLength
    },
    textOverflow() {
      return this.postCounter < 0
    },
    hasNoText() {
      return this.textLength === 0
    },
    disabled() {
      const sending = !!this.promise
      return !!(
        this.textOverflow ||
        this.hasNoText ||
        sending ||
        (this.poll && !this.availablePoll) ||
        (this.spoiler && !this.availableSpoiler) ||
        (this.longpost && !this.availableLongpost)
      )
    },
    availablePoll() {
      return (
        this.poll &&
        this.poll.options &&
        this.poll.options.filter(option => option.text).length >= 2
      )
    },
    availableSpoiler() {
      return (
        this.spoiler &&
        this.spoiler.topic &&
        this.spoiler.topic.length > 0 &&
        this.spoiler.topic.length <= 128
      )
    },
    availableLongpost() {
      return (
        this.longpost &&
        this.longpost.body &&
        this.longpost.body.length > 0 &&
        this.longpost.body.length <= 6144 &&
        (!this.longpost.title || this.longpost.title.length < 128)
      )
    },
    hasPhotos() {
      return this.photos.length
    },
    ...mapGetters(['user', 'storage'])
  },
  watch: {
    async photos() {
      const promisePhotos = this.photos.map(file => {
        return new Promise(resolve => {
          const fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = e => {
            file.data = e.target.result
            resolve(file)
          }
        })
      })
      this.previewPhotos = await Promise.all(promisePhotos)
    }
  },

  created() {
    this.text = this.initialText
  },
  mounted() {
    if (this.focus) {
      this.setFocus()
    }
    if (this.replyTarget) {
      const notMe = this.user.username !== this.replyTarget.user.username
      if (notMe) {
        this.text = `@${this.replyTarget.user.username} `
      }

      this.replyStartPos = this.text.length

      let mentions = [this.replyTarget.user.username.toLowerCase()]
      for (
        var i = this.replyTarget.content.entities.mentions.length - 1;
        i >= 0;
        i--
      ) {
        var mention = this.replyTarget.content.entities.mentions[
          i
        ].text.toLowerCase()
        if (
          mentions.indexOf(mention) == -1 &&
          mention !== this.user.username.toLowerCase()
        ) {
          this.text += `@${this.replyTarget.content.entities.mentions[i].text} `
          mentions.push(mention)
        }
      }
    }
  },
  methods: {
    insertText(text) {
      const { textarea } = this.$refs
      if (document.selection) {
        textarea.focus()
        const sel = document.selection.createRange()
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
        this.text = +text
        textarea.focus()
      }
    },
    togglePoll() {
      this.poll = this.poll ? null : {}
    },
    toggleSpoiler() {
      this.spoiler = this.spoiler ? null : {}
    },
    toggleLongpost() {
      this.longpost = this.longpost ? null : {}
    },
    getSheet() {
      return emojiSource
    },
    setFocus() {
      if (this.focus === false) return
      // occur error if it not displayed like logged out
      const { textarea } = this.$refs
      if (this.text.length === undefined) {
        this.text.length = this.replyStartPos
      }
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
    },
    async uploadPoll() {
      this.poll.options = this.poll.options.filter(option => option.text)
      return await this.$axios.$post('/polls', {
        ...this.poll,
        prompt: this.poll.prompt || this.text
      })
    },
    async submit() {
      if (this.promise || this.textOverflow || this.hasNoText) return false
      const option = {
        text: this.text,
        raw: []
      }
      try {
        if (this.hasPhotos) {
          const raws = await this.uploadPhotos()
          option.raw.push(...raws)
        }
        if (this.replyTarget) {
          option.reply_to = this.replyTarget.id
        }
        if (this.spoiler) {
          option.raw.push({
            type: 'shawn.spoiler',
            value: {
              topic: this.spoiler.topic
            }
          })
        }
        if (this.longpost) {
          option.raw.push({
            type: 'nl.chimpnut.blog.post',
            value: this.longpost
          })
        }
        if (this.hasPoll) {
          const {
            data: { id: poll_id, poll_token }
          } = await this.uploadPoll()
          option.raw.push({
            type: 'io.pnut.core.poll-notice',
            value: {
              '+io.pnut.core.poll': {
                poll_token,
                poll_id
              }
            }
          })
        }
      } catch (e) {
        console.error(e)
        this.$toast.error(e.message)
        return
      }
      this.promise = this.$axios.$post('/posts', option)
      await this.$nextTick()
      return this.promise
        .then(res => {
          this.promise = null
          bus.$emit('post', res.data)
          this.$emit('post', res.data)
          this.text = ''
          this.photos = []
          this.poll = null
          this.spoiler = null
          this.longpost = null
        })
        .finally(() => ((this.promise = null), this.$toast.success('Posted!')))
    },
    async uploadPhotos() {
      const photosPromise = this.photos.map(async content => {
        const data = obj2FormData({
          type: 'net.unsweets.beta',
          name: content.name,
          kind: 'image',
          content,
          is_public: true
        })
        const res = await this.$axios.$post('/files', data, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        return res
      })
      this.promise = true
      const photosJson = await Promise.all(photosPromise)
      const raws = photosJson.map(res => {
        const image = res.data
        const value = {
          '+io.pnut.core.file': {
            file_id: image.id,
            file_token: image.file_token,
            format: 'oembed'
          }
        }
        return Object.assign(
          {},
          {
            type: 'io.pnut.core.oembed'
          },
          { value }
        )
      })
      return raws
    },
    fileChange(e) {
      if (!e.target.files.length) return
      this.photos.push(...Array.prototype.slice.call(e.target.files))
      // reset file form for detecting changes(if there `sn't below code, not working when is selected same file)
      this.$refs.file.value = ''
    },
    addEmoji(emoji) {
      this.insertText(emoji.native)
      this.closeEmojiPalette()
    },
    showEmojiPalette() {
      this.showEmojiPicker = true
    },
    toggleEmojiPalette() {
      this.showEmojiPicker = !this.showEmojiPicker
    },
    closeEmojiPalette() {
      this.showEmojiPicker = false
    }
  }
}

function obj2FormData(obj) {
  return Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
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
