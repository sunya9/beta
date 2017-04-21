<template>
  <div class="my-4 compose" v-if="user">
    <div class="card">
      <form class="card-block" @submit.prevent="submit">
        <div class="form-group">
          <textarea @keyup.ctrl.enter="submit"
            @keyup.meta.enter="submit"
            cols="10" rows="3"
            class="form-control" v-model.trim="text"
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
      <div class="card-block" v-if="replyTarget">
        <div class="d-flex justify-content-between">
          <h6>Reply to…</h6>
          <button class="btn btn-link px-0" @click="cancelReply">
            <i class="fa fa-times fa-fw fa-lg"></i>
          </button>
        </div>
        <post :data="replyTarget" view-only />
      </div>
    </div>
  </div>
</template>

<script>
import api from '~plugins/api'
import { mapState } from 'vuex'
import Post from '~components/Post'
import bus from '~assets/js/bus'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: Boolean
  },
  data() {
    return {
      promise: null,
      tempCount: 0,
      text: '',
      replyTarget: null
    }
  },
  beforeDestroy() {
    bus.$off('setReply', this.setReply)
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
    bus.$on('setReply', this.setReply)
  },
  mounted () {
    if(this.focus)
      this.$refs.textarea.focus()
  },
  methods: {
    setReply(post) {
      this.replyTarget = post
      const text = `@${post.user.username} `
      if (text !== this.text) {
        this.text = text + this.text
      }
      this.$refs.textarea.focus()
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
          this.$emit('post', res.data)
          this.replyTarget = null
        }).catch(console.error.bind(console))
    },
    // for IME
    // https://vuejs.org/v2/guide/forms.html#Basic-Usage
    textCount(e) {
      this.tempCount = e.target.value.trim().length
    },
    cancelReply() {
      const text = `@${this.replyTarget.user.username} `
      if(this.text === text) {
        this.text = ''
      }
      this.replyTarget = null
    }
  },
  components: {
    Post
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.compose {
  @include no-gutter-xs
}
</style>