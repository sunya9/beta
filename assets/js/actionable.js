import axios from 'axios'

export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    resource: String,
    checked: Boolean
  },
  data() {
    return {
      processing: null
    }
  },
  computed: {
    method() {
      return this.checked ? 'delete' : 'put'
    }
  },
  methods: {
    // Don't use the way to watch `checked`.
    // If you use watch, might to occur infinite loops when revert checked state.
    change(newVal) {
      this.$emit('change', newVal)
      if (!this.resource) return
      this.processing = axios[this.method](`/proxy${this.resource}`)
      const old = this.checked
      return this.processing
        .then(() => {
          this.processing = null
        })
        .catch(() => {
          this.processing = null
          this.$emit('change', old)
        })
    }
  }
}
