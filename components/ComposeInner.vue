<template>
  <form class="card-body" @submit.prevent="submit">
    <div class="form-group">
      <textarea @keydown.ctrl.enter="submit"
        @keydown.meta.enter="submit"
        cols="10" rows="5"
        class="form-control textarea" v-model.trim="text"
        :disabled="promise"
        @input="textCount"
        ref="textarea"
      ></textarea>
    </div>
    <div class="form-group" v-show="photos.length">
      <transition-group
        tag="div"
        name="photos"
        class="d-flex flex-wrap justify-cotnent align-items-center">
        <thumb
          :key="photo.data"
          v-for="(photo, i) in previewPhotos"
          :original="photo.data"
          :thumb="photo.data"
          removable
          class="mr-2"
          @remove="photos.splice(i, 1)"
          />
        </transition-group>
    </div>
    <div v-if="error" class="alert alert-danger fade show" role="alert">
      {{ error }}
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <strong class="text-muted">{{count}}</strong>
        <div>
          <button
            v-show="!noPhoto"
            v-if="$store.state.user.storage"
            type="button"
            @click="addPhoto"
            class="btn btn-link text-muted"
            :disabled="promise">
            <i class="fa fa-picture-o"></i>&nbsp;
            Add photo…
          </button>
          <input type="file" multiple @change="fileChange" style="display: none" ref="file">
          <button type="submit"
            class="btn text-uppercase"
            :class="'btn-' + (disabled ? 'secondary' : 'primary')"
            :disabled="disabled">
            <span v-show="promise">
              <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
            </span>
            Post
          </button>
        </div>
    </div>
  </form>
</template>

<script>
import api from '~/plugins/api'
import Post from '~/components/Post'
import bus from '~/assets/js/bus'
import { mapState } from 'vuex'
import Thumb from '~/components/Thumb'
import stringLength from 'string-length'
import axios from 'axios'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: null,
    thread: Boolean,
    replyTarget: Object,
    noPhoto: Boolean
  },
  data () {
    return {
      promise: null,
      tempCount: 0,
      text: '',
      photos: [],
      previewPhotos: [],
      error: null
    }
  },
  watch: {
    async photos () {
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
    count () {
      return 256 - Math.max(this.getTextLength(this.text), this.tempCount)
    },
    disabled () {
      const sending = !!this.promise
      const someContents = this.text.length
      const textLimit = this.count < 0
      return textLimit || !someContents || sending
    },
    ...mapState(['user'])
  },
  created () {
    if (this.initialText) { this.text = this.initialText }
  },
  mounted () {
    if (this.focus) { this.setFocus() }
    if (this.replyTarget) {
      this.text = this.user.username === this.replyTarget.user.username
        ? ''
        : `@${this.replyTarget.user.username} `
    }
  },
  methods: {
    setFocus () {
      // occur error if it not displayed like logged out
      if (this.$refs.textarea) {
        switch (typeof this.focus) {
          case 'object': { // == array
            const [start, end] = this.focus
            this.setCaret(start, end)
            break
          }
          case 'string':
          case 'number': {
            this.setCaret(+this.focus)
            break
          }
          case 'boolean':
          default: {
            this.setCaret(this.$refs.textarea.value.length)
            break
          }
        }
      }
    },
    setCaret (start, end) {
      if (end === undefined) {
        end = start
      }
      const input = this.$refs.textarea
      if ('selectionStart' in input) {
        input.selectionStart = start
        input.selectionEnd = end
      } else if (input.setSelectionRange) {
        input.setSelectionRange(start, end)
      } else if (input.createTextRange) {
        const range = input.createTextRange()
        range.collapse(true)
        range.moveEnd('character', end)
        range.moveStart('character', start)
        range.select()
      }
      input.focus()
    },
    async submit () {
      const option = {
        text: this.text,
        raw: []
      }

      const hasPhotos = this.photos.length > 0

      if (hasPhotos) {
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
        const photosJson = await Promise.all(photosPromise)
        const raws = photosJson.map(res => {
          const image = res.data.data
          return Object.assign({}, {
            type: 'io.pnut.core.oembed'
          }, {
            value: {
              width: image.image_info.width,
              height: image.image_info.height,
              version: '1.0',
              type: 'photo',
              url: image.link,
              title: this.text
            }
          })
        })
        option.raw.push(...raws)
      }
      if (this.replyTarget) {
        option.reply_to = this.replyTarget.id
      }

      this.promise = api().post('/posts', option)
        .then(res => {
          this.text = ''
          this.promise = null
          this.error = null
          bus.$emit('post', res.data)
          this.$emit('post', res.data)
          this.resetPost()
        }).catch(e => {
          console.error(e)
          const { response: { data: { message } } } = e
          this.error = message
          this.promise = null
        })
    },
    // for IME
    // https://vuejs.org/v2/guide/forms.html#Basic-Usage
    textCount (e) {
      this.tempCount = this.getTextLength(e.target.value.trim())
    },
    cancelReply () {
      this.replyTarget = null
    },
    resetPost () {
      this.text = ''
      this.tempCount = 0
      this.photos = []
    },
    addPhoto () {
      this.$refs.file.click()
    },
    fileChange (e) {
      if (!e.target.files.length) return
      this.photos.push(...Array.prototype.slice.call(e.target.files))
      // reset file form for detecting changes(if there isn't below code, not working when is selected same file)
      this.$refs.file.value = ''
    },
    getTextLength (str) {
      // http://stackoverflow.com/a/32382702
      const markdown = str.replace(/\[([^\]]+)\][^)]+\)/g, '$1')
      return stringLength(markdown)
    }
  },
  components: {
    Post, Thumb
  }
}

function obj2FormData (obj) {
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

@include media-breakpoint-down(xs) {
  .textarea {
    font-size: 16px;
  }
}
.photos-enter-active, .photos-leave-to {
  transition: all .5s ease;
}
.photos-enter, .photos-leave-to {
  opacity: 0;
  transform: scale(0);
}
.photos-move {
  transition: transform .5s;
}
</style>
