<template>
  <form class="card-block" @submit.prevent="submit">
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
            v-for="(photo, i) in photos"
            :original="photo.data"
            :thumb="photo.data"
            removable
            class="mr-2"
            @remove="photos.splice(i, 1)"
            />
          </transition-group>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <strong class="text-muted">{{count}}</strong>
        <div>
          <button
            v-show="imgur"
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
import api from '~plugins/api'
import Post from '~components/Post'
import bus from '~assets/js/bus'
import { mapState } from 'vuex'
import Thumb from '~components/Thumb'
import axios from 'axios'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: Boolean,
    thread: Boolean,
    replyTarget: Object
  },
  data() {
    return {
      promise: null,
      tempCount: 0,
      text: '',
      imgur: null,
      photos: []
    }
  },

  computed: {
    count() {
      return 256 - Math.max(this.getTextLength(this.text), this.tempCount)
    },
    disabled() {
      const sending = !!this.promise
      const someContents = this.photos.length
        || this.text.length
      const textLimit = this.count < 0
      return textLimit || !someContents || sending
    },
    ...mapState(['user'])
  },
  created() {
    if(this.initialText)
      this.text = this.initialText
  },
  mounted () {
    if(this.focus)
      this.setFocus()
    if(this.replyTarget) {
      this.text = this.user.username === this.replyTarget.user.username
          ? ''
          : `@${this.replyTarget.user.username} `
    }
    const imgur = localStorage.getItem('imgur')
    this.imgur = imgur ? JSON.parse(imgur) : null
  },
  methods: {
    setFocus() {
      // occur error if it not displayed like logged out
      if(this.$refs.textarea) {
        this.$refs.textarea.focus()
      }
    },
    async submit() {
      const option = {
        text: this.text,
        raw: []
      }

      if(this.photos.length) {
        this.promise = true
        // image upload
        const imgur = localStorage.getItem('imgur')
        const token = JSON.parse(imgur)
        const images = this.photos.map(photo => {
          const [, image] = photo.data.split(',')
          return image
        })
        const params = {
          token,
          images,
          title: this.text
        }
        try {
          const { data: urls } = await axios.post('/imgur/post', params)
          const raws = urls.map(obj => {
            // add version and type
            const value = Object.assign({}, obj, {
              type: 'photo',
              version: '1.0',
            })
            const res = {
              type: 'io.pnut.core.oembed',
              value
            }
            return res
          })
          option.raw.push(...raws)
        } catch(e) {
          console.error(e)
          return
        }
      }
      if(this.replyTarget) {
        option.reply_to = this.replyTarget.id
      }
      this.promise = api().post('/posts', option)
        .then(res => {
          this.text = ''
          this.promise = null
          bus.$emit('post', res.data)
          this.$emit('post', res.data)
          this.resetPost()
        }).catch(console.error.bind(console))
    },
    // for IME
    // https://vuejs.org/v2/guide/forms.html#Basic-Usage
    textCount(e) {
      this.tempCount = this.getTextLength(e.target.value.trim())
    },
    cancelReply() {
      this.replyTarget = null
    },
    resetPost() {
      this.text = ''
      this.tempCount = 0
      this.photos = []
    },
    addPhoto() {
      this.$refs.file.click()
    },
    fileChange(e) {
      if(!e.target.files.length) return
      const photosPromise = Array.prototype.slice
        .call(e.target.files)
        .map(file => {
          return new Promise(resolve => {
            const fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = e => {
              file.data = e.target.result
              resolve(file)
              }
          })
        })
      Promise.all(photosPromise)
        .then(photos => this.photos.push(...photos))
    },
    getTextLength(str) {
      // http://stackoverflow.com/a/32382702
      return str.replace(/\[([^\]]+)\][^\)]+\)/g, '$1').length
    }
  },
  components: {
    Post, Thumb
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/mixins/breakpoints';
@import '~bootstrap/scss/variables';

@include media-breakpoint-down(xs) {
  .textarea {
    font-size: 16px;
  }
}
.photos-enter-active, .photos-leave-active {
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