<template>
  <form class="card-block" @submit.prevent="submit">
    <div class="form-group">
      <textarea @keydown.ctrl.enter="submit"
        @keydown.meta.enter="submit"
        cols="10" rows="4"
        class="form-control textarea" v-model.trim="text"
        :disabled="promise"
        @input="textCount"
        ref="textarea"
      ></textarea>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <strong class="text-muted">{{count}}</strong>
        <div>
          <a href="" v-if="false" @click="fileClick" class="btn btn-link text-muted" :disabled="disabled">
            <i class="fa fa-picture-o"></i>&nbsp;
            Add photo…
          </a>
          <input type="file" style="display: none">
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
    }
  },

  computed: {
    count() {
      return 256 - Math.max(this.text.length, this.tempCount)
    },
    disabled() {
      return this.promise || !this.text.length || this.count < 0
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
  },
  methods: {
    setFocus() {
      // occur error if it not displayed like logged out
      if(this.$refs.textarea) {
        this.$refs.textarea.focus()
      }
    },
    submit() {
      const option = {
        text: this.text
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
      this.tempCount = e.target.value.trim().length
    },
    cancelReply() {
      this.replyTarget = null
    },
    resetPost() {
      this.text = ''
      this.tempCount = 0
    }
  },
  components: {
    Post
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
</style>