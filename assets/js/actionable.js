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
      promise: null
    }
  },
  computed: {
    processing() {
      return this.promise
    },
    method() {
      return this.checked ? 'delete' : 'put'
    }
  },
  methods: {
    change(newVal) {
      if (!this.resource) return
      this.promise = axios[this.method](`/proxy${this.resource}`)
      const old = this.checked
      this.$emit('change', newVal)
      return this.promise
        .then(() => {
          this.promise = null
        })
        .catch(() => {
          this.promise = null
          this.$emit('change', old)
        })
    }
  }
}
