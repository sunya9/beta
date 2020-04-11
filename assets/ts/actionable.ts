import Vue, { PropOptions } from 'vue'

export const actionable = Vue.extend({
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    resource: {
      type: String,
      required: false,
      default: ''
    },
    checked: {
      type: Boolean,
      required: true
    } as PropOptions<boolean>
  },
  data(): {
    processing: Promise<any> | null
  } {
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
    async change(newVal: boolean) {
      this.$emit('change', newVal)
      if (!this.resource) return
      this.processing = this.$axios(this.resource, {
        method: this.method
      })
      const old = this.checked
      await this.processing.catch(() => {
        this.$emit('change', old)
      })
      this.processing = null
    },
    toggle() {
      this.change(!this.checked)
    }
  }
})
