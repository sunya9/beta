<template>
  <div :class="{'mb-4 compose': !compact}" v-if="user">
    <div class="card" :class="{'border-0': compact}">
      <form
        class="card-body"
        :class="{'p-0': compact}"
        @submit.prevent="submit">
          <div class="form-group relative">
            <rich-textarea
              ref="textarea"
              class="form-control textarea"
              v-model="rawText"
              @update:compiledText="updateCompiledText"
              @update:compiledTextCount="updateCompiledTextLength"
              @submit="submit"
              :disabled="!!promise" />
            <a href="#" class="open-emoji-picker text-dark" @click.stop="toggleEmojiPalette">
              <i class="fa fa-lg fa-smile-o"></i>
            </a>
            <picker v-if="mounted" set="emojione" class="emoji-picker" @click="addEmoji" v-show="showEmojiPicker" v-on-click-outside="closeEmojiPalette" />
          </div>
          <div class="form-group" v-show="photos.length">
            <transition-group tag="div" name="photos" class="d-flex flex-wrap justify-cotnent align-items-center">
              <thumb :key="photo.data" v-for="(photo, i) in previewPhotos" :original="photo.data" :thumb="photo.data" removable class="mr-2" @remove="photos.splice(i, 1)" />
            </transition-group>
          </div>
          <div v-if="error" class="alert alert-danger fade show" role="alert">
            {{ error }}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-muted">{{postCounter}}</strong>
            <div>
              <label
                v-show="!noPhoto"
                v-if="$store.state.user.storage"
                class="btn btn-link text-muted add-photo"
                :disabled="promise">
                <i class="fa fa-picture-o"></i>&nbsp; Add photo…
                <input type="file" multiple
                  accept="image/*"
                  @change="fileChange"
                  style="display: none" ref="file">
              </label>
              <button type="submit" class="btn text-uppercase" :class="'btn-' + (disabled ? 'secondary' : 'primary')" :disabled="disabled">
                <span v-show="promise">
                  <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
                </span>
                Post
              </button>
            </div>
          </div>
        </form>
    </div>
  </div>
</template>

<script>
import api from '~/plugins/api'
import Post from '~/components/Post'
import bus from '~/assets/js/bus'
import { mapState } from 'vuex'
import Thumb from '~/components/Thumb'
import axios from 'axios'
import { Picker } from '~/plugins/emoji'
import RichTextarea from '~/components/RichTextarea'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: null,
    replyTarget: Object,
    noPhoto: Boolean,
    compact: Boolean
  },
  data() {
    return {
      promise: null,
      photos: [],
      previewPhotos: [],
      error: null,
      rawText: this.initialText,
      showEmojiPicker: false,
      mounted: false,
      compiledText: '',
      compiledTextLength: 0
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
    postCounter() {
      return 256 - this.compiledTextLength
    },
    textOverflow() {
      return this.postCounter < 0
    },
    hasNotText() {
      return this.compiledTextLength === 0
    },
    disabled() {
      const sending = !!this.promise
      return this.textOverflow || this.hasNotText || sending
    },
    hasPhotos() {
      return this.photos.length
    },
    ...mapState(['user'])
  },
  mounted() {
    this.mounted = true
    if (this.focus) { this.setFocus() }
    if (this.replyTarget) {
      const notMe = this.user.username !== this.replyTarget.user.username
      if (notMe) {
        this.rawText = `@${this.replyTarget.user.username} `
      }
    }
  },
  methods: {
    updateCompiledText(compiledText) {
      this.compiledText = compiledText
    },
    updateCompiledTextLength(length) {
      this.compiledTextLength = length
    },
    setFocus() {
      if (this.focus === false) return
      // occur error if it not displayed like logged out
      const { textarea } = this.$refs
      switch (typeof this.focus) {
        case 'object': { // == array
          const [start, end] = this.focus
          textarea.setCaret(start, end)
          break
        }
        case 'string':
        case 'number': {
          textarea.setCaret(+this.focus)
          break
        }
        case 'boolean':
        default: {
          textarea.setCaret(this.rawText.length)
          break
        }
      }
    },
    async submit() {
      if (this.textOverflow || this.hasNotText) return false
      const option = {
        text: this.compiledText,
        raw: []
      }

      if (this.hasPhotos) {
        const raws = await this.uploadPhotos()
        option.raw.push(...raws)
      }
      if (this.replyTarget) {
        option.reply_to = this.replyTarget.id
      }

      this.promise = api().post('/posts', option)
        .then(res => {
          this.promise = null
          this.error = null
          bus.$emit('post', res.data)
          this.$emit('post', res.data)
          this.rawText = ''
          this.photos = []
        }).catch(e => {
          console.error(e)
          const { response: { data: { message } } } = e
          this.error = message
          this.promise = null
        })
      return this.promise
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
        const res = await axios.post('/proxy/files', data, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        return res
      })
      this.promise = true
      const photosJson = await Promise.all(photosPromise)
      const raws = photosJson.map(res => {
        const image = res.data.data
        const value = {
          width: image.image_info.width,
          height: image.image_info.height,
          version: '1.0',
          type: 'photo',
          url: image.link,
          title: this.text
        }
        return Object.assign({}, {
          type: 'io.pnut.core.oembed'
        }, { value })
      })
      return raws
    },
    fileChange(e) {
      if (!e.target.files.length) return
      this.photos.push(...Array.prototype.slice.call(e.target.files))
      // reset file form for detecting changes(if there isn't below code, not working when is selected same file)
      this.$refs.file.value = ''
    },
    addEmoji(emoji) {
      this.$refs.textarea.insertText(emoji.colons)
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
    Post, Thumb, Picker, RichTextarea
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
  @include no-gutter-xs
}

@include media-breakpoint-down(xs) {
  .textarea {
    font-size: 16px;
  }
}

.photos-enter-active,
.photos-leave-to {
  transition: all .5s ease;
}

.photos-enter,
.photos-leave-to {
  opacity: 0;
  transform: scale(0);
}

.photos-move {
  transition: transform .5s;
}

.relative {
  position: relative;
}

.open-emoji-picker {
  position: absolute;
  left: .5rem;
  bottom: .5rem;
}

.textarea {
  padding-bottom: 2rem;
  min-height: 7rem;
}

.emoji-picker {
  position: absolute;
  left: 0;
  top: calc(100% - 1px);
  z-index: 3;
}

.add-photo {
  cursor: pointer;
  margin-bottom: 0;
}
</style>
