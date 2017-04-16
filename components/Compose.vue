<template>
  <div class="card">
    <form class="card-block" @submit.prevent="submit">
      <div class="form-group">
        <textarea @keyup.ctrl.enter="submit"
          cols="10" rows="4"
          class="form-control" v-model="text"
          :disabled="promise"
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
            <button type="submit" class="btn btn-primary" :disabled="disabled">
              <span v-show="promise">
                <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
              </span>
              POST
            </button>
          </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '~plugins/axios'

export default {
  data() {
    return {
      text: '',
      promise: null
    }
  },
  computed: {
    count() {
      return 256 - this.text.length
    },
    disabled() {
      return this.promise || !this.text.length
    }
  },
  methods: {
    submit() {
      this.promise = axios.post('/posts', {
        text: this.text
      }).then(res => {
        console.log(res)
        this.text = ''
        this.promise = null
      }).catch(console.error.bind(console))
    }
  }
}
</script>