<template>
	<div :class="{'mb-4 compose': !compact}" v-if="user">
		<div class="card" :class="{'border-0': compact}">
			<form class="card-body" :class="{'p-0': compact}" @submit.prevent="submit">
				<div class="form-group relative">
					<textarea class="form-control textarea" @keydown.ctrl.enter="submit" @keydown.meta.enter="submit" v-model="text" ref="textarea" @submit="submit" :disabled="!!promise" />
					<a href="#" class="open-emoji-picker text-dark" @click.prevent.stop="toggleEmojiPalette">
						<i class="fa fa-lg fa-smile-o"></i>
					</a>
					<no-ssr>
						<picker ref="picker" :background-image-fn="getSheet" set="twitter" class="emoji-picker" @select="addEmoji" v-show="showEmojiPicker" v-on-click-outside="closeEmojiPalette" />
					</no-ssr>
				</div>
				<div class="form-group" v-show="photos.length">
					<transition-group tag="div" name="photos" class="d-flex flex-wrap justify-cotnent align-items-center">
						<thumb :key="photo.data" v-for="(photo, i) in previewPhotos" :original="photo.data" :thumb="photo.data" removable class="mr-2" @remove="photos.splice(i, 1)" />
					</transition-group>
				</div>
				<div class="d-flex justify-content-between align-items-center">
					<strong class="text-muted" data-test-id="post-counter">{{postCounter}}</strong>
					<div>
						<button class="btn btn-link add-poll mr-3" type="button" @click="togglePoll" :class="{
                  'text-dark': !hasPoll,
                  'btn-primary': hasPoll
                }">
							<i class="fa fa-bar-chart"></i>
							<span class="d-none d-sm-inline ml-2">Add a poll...</span>
						</button>
						<label v-show="!noPhoto" v-if="$store.state.user.storage.available" class="btn btn-link text-dark add-photo mr-3" :disabled="promise">
							<i class="fa fa-picture-o"></i>
							<span class="d-none d-sm-inline ml-2">Add photo…</span>
							<input type="file" multiple accept="image/*" @change="fileChange" style="display: none" ref="file">
						</label>
						<button type="submit" class="ml-1 btn btn-primary text-uppercase" :disabled="disabled">
							<span v-show="promise">
								<i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
							</span>
							Post
						</button>
					</div>
				</div>
				<input-poll @update:poll="p => poll = p" v-if="poll" class="mt-3" />
			</form>
		</div>
	</div>
</template>

<script>
import Post from '~/components/Post'
import bus from '~/assets/js/bus'
import { mapState } from 'vuex'
import Thumb from '~/components/Thumb'
import { Picker } from '~/plugins/emoji'
import emojiSource from 'emoji-datasource-twitter/img/twitter/sheets/64.png'
import InputPoll from '~/components/InputPoll'
import textCount from '~/assets/js/text-count'

export default {
  mixins: [textCount],
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: null,
    replyTarget: Object,
    replyAll: Boolean,
    noPhoto: Boolean,
    compact: Boolean
  },
  data() {
    return {
      promise: null,
      photos: [],
      previewPhotos: [],
      text: this.initialText,
      replyStartPos: 0,
      showEmojiPicker: false,
      poll: null
    }
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

  computed: {
    hasPoll() {
      return this.poll
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
        (this.poll && !this.availablePoll)
      )
    },
    availablePoll() {
      return (
        this.poll &&
        this.poll.options &&
        this.poll.options.filter(option => option.text).length >= 2
      )
    },
    hasPhotos() {
      return this.photos.length
    },
    ...mapState(['user'])
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
          width: image.image_info.width,
          height: image.image_info.height,
          version: '1.0',
          type: 'photo',
          url: image.link,
          title: this.text
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
  },
  components: {
    Post,
    Thumb,
    Picker,
    InputPoll
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
