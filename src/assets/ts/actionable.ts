import Vue from 'vue'
import { Model, Prop, Component } from 'nuxt-property-decorator'

@Component({})
class Actionable extends Vue {
  @Model('change', {
    default: false,
    type: Boolean,
  })
  checked!: boolean

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  resource!: string

  processing: Promise<any> | null = null
  get method() {
    return this.checked ? 'delete' : 'put'
  }

  // Don't use the way to watch `checked`.
  // If you use watch, might to occur infinite loops when revert checked state.
  async change(newVal: boolean) {
    this.$emit('change', newVal)
    if (!this.resource) return
    const processing = this.$axios(this.resource, {
      method: this.method,
    })
    const old = this.checked
    this.processing = processing
    await processing.catch(() => {
      this.$emit('change', old)
    })
    this.processing = null
  }

  toggle() {
    this.change(!this.checked)
  }
}

export const actionable = Actionable
