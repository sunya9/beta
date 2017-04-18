<template>
  <div class="my-4">
    <div class="card">
      <form class="card-block" @submit.prevent="submit">
        <div class="form-group">
          <textarea @keyup.ctrl.enter="submit"
            cols="10" rows="4"
            class="form-control" v-model="text"
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
      <div class="card-block" v-if="replyTarget" >
        <div class="d-flex justify-content-between">
          <h6>Reply to…</h6>
          <button class="btn btn-link px-0" @click="cancelReply">
            <i class="fa fa-times fa-fw fa-lg"></i>
          </button>
        </div>
        <post :data="replyTarget" view-only="true" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '~plugins/api'
import { mapState } from 'vuex'
import Post from '~components/Post'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    }
  },
  created() {
    this.text = this.initialText
    this.$store.subscribe(mutation => {
      if(mutation.type === 'SET_REPLY' && this.$refs.textarea) {
        this.$refs.textarea.focus()
      }
    })
  },
  data() {
    return {
      promise: null,
      tempCount: 0
    }
  },
  computed: {
    count() {
      return 256 - Math.max(this.text.length, this.tempCount)
    },
    disabled() {
      return this.promise || !this.text.length || this.count < 0
    },
    text: {
      get() {
        return this.$store.state.composeText
      },
      set(val) {
        this.$store.commit('UPDATE_COMPOSE', val)
      }
    },
    ...mapState(['replyTarget'])
  },
  methods: {
    submit() {
      this.promise = api().post('/posts', {
        text: this.text,
        reply_to: this.replyTarget && this.replyTarget.id
      }).then(res => {
        this.text = ''
        this.promise = null
        this.$emit('post', res.data)
      }).catch(console.error.bind(console))
    },
    // for IME
    // https://vuejs.org/v2/guide/forms.html#Basic-Usage
    textCount(e) {
      this.tempCount = e.target.value.length
    },
    cancelReply() {
      this.$store.commit('REMOVE_REPLY')
    }
  },
  components: {
    Post
  }
}
</script>