<template>
  <promise-modal ref="promiseModal" @show="show" @hide="hide">
    <div
      ref="modal"
      slot-scope="{ ok }"
      class="modal"
      role="dialog"
      tabindex="-1"
      aria-hidden="true"
    >
      <div
        :class="{ [`modal-${size}`]: size }"
        class="modal-dialog"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="header">
                {{ title }}
              </slot>
            </h5>
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="hideRequest"
            >
              <span aria-hidden="true">
                &times;
              </span>
            </button>
          </div>
          <div class="modal-body">
            <slot :ok="ok" :canchel="hideRequest" />
          </div>
          <div v-if="!$slots.footer && !hideFooter" class="modal-footer">
            <slot :ok="ok" :cancel="hideRequest" name="footer">
              <button
                ref="cancel"
                :form="form"
                type="button"
                tabindex="1"
                class="btn btn-secondary"
                @click="hideRequest(cancelCb())"
              >
                Cancel
              </button>
              <button
                ref="ok"
                :form="form"
                :disabled="okDisabled"
                class="btn btn-primary"
                tabindex="2"
                @click="ok(okCb())"
              >
                {{ okText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </promise-modal>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Modal } from 'bootstrap.native'

export default Vue.extend({
  name: 'BaseModal',
  props: {
    suppressWarnings: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    okCb: {
      type: Function,
      default: () => () => {},
    },
    cancelCb: {
      type: Function,
      default: () => () => {},
    },
    autoFocus: {
      type: String,
      default: null,
      validator: (str) => ['ok', 'cancel'].includes(str),
    } as PropOptions<'ok' | 'cancel'>,
    okDisabled: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: 'OK',
    },
    size: {
      type: String,
      default: '',
      validator: (str) => ['', 'lg', 'sm'].includes(str),
    },
    form: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modal: null as Modal | null,
    }
  },
  watch: {
    '$route.fullPath'() {
      if (!this.modal) return
      this.hideRequest()
    },
  },
  mounted() {
    const modalEl = this.$refs.modal as Element
    this.modal = new Modal(modalEl)
    modalEl.addEventListener('shown.bs.modal', this.shown)
    modalEl.addEventListener('hidden.bs.modal', this.hidden)
  },
  beforeDestroy() {
    const modalEl = this.$refs.modal as Element
    modalEl.removeEventListener('shown.bs.modal', this.shown)
    modalEl.removeEventListener('hidden.bs.modal', this.hidden)
  },
  methods: {
    show(...arg: any[]) {
      if (!this.modal) return
      this.modal.show()
      this.$emit('show', ...arg)
      this.$mousetrap.pause()
    },
    shown() {
      // TODO
      if (this.autoFocus) (this.$refs[this.autoFocus] as any).focus()
      this.$emit('shown')
    },
    hideRequest() {
      // TODO
      const action = this.suppressWarnings ? 'ok' : 'cancel'
      return (this.$refs.promiseModal as any)[action]()
    },
    hide() {
      if (!this.modal) return
      this.modal.hide()
    },
    hidden() {
      this.$mousetrap.unpause()
      if (!this.hideRequest()) this.$emit('hidden')
    },
  },
})
</script>
