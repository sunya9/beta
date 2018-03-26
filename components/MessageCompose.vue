<template>
  <div class="card mb-4 no-gutter-xs">
    <div class="card-body">
      <form @submit.prevent="submit">
        <slot name="header" :disabed="promise"></slot>
        <div class="form-group">
          <textarea
            class="form-control"
            :value="value"
            @input="$emit('input', $event.target.value)"
            @keyup.ctrl.enter="submit"
            :disabled="promise"
          >
          </textarea>
        </div>
        <slot name="footer"></slot>
        <div class="d-flex justify-content-end">
          <button
            type="submit"
            class="btn text-uppercase btn-primary"
            :disabled="calcDisabled">
            <span v-show="promise">
              <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
            </span>
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    disabled: Boolean,
    value: String,
    preventHandle: Boolean
  },
  data() {
    return {
      promise: null
    }
  },
  computed: {
    calcDisabled() {
      return this.disabled || this.promise || !this.value
    }
  },
  methods: {
    async submit(e) {
      if (this.preventHandle) {
        e.preventDefault()
        this.$emit('submit')
        return
      }
      const option = {
        text: this.value
      }
      this.promise = this.$axios.$post(
        `/channels/${this.$route.params.channel}/messages`,
        option
      )
      const { meta } = await this.promise
      if (meta.code === 201) {
        this.$emit('submit')
      }
      this.promise = null
    }
  }
}
</script>

<style scoped>
textarea {
  min-height: 5rem;
}
</style>
