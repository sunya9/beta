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
    </div>
  </div>
</template>

<script>
import api from '~plugins/api'

export default {
  data() {
    return {
      text: '',
      promise: null,
      tempCount: 0
    }
  },
  computed: {
    count() {
      return 256 - Math.max(this.text.length, this.tempCount)
    },
    disabled() {
      return this.promise || !this.text.length
    }
  },
  methods: {
    submit() {
      this.promise = api(null, {
        resource: '/posts',
        method: 'post',
        body: {
          text: this.text
        }
      }).then(res => {
        console.log(res)
        this.text = ''
        this.promise = null
      }).catch(console.error.bind(console))
    },
    // for IME
    // https://vuejs.org/v2/guide/forms.html#Basic-Usage
    textCount(e) {
      this.tempCount = e.target.value.length
    }
  }
}
</script>