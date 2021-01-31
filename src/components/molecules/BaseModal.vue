<template>
  <promise-modal ref="promiseModal" v-slot="{ ok }" @show="show" @hide="hide">
    <div
      ref="modal"
      class="modal fade"
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
              <span aria-hidden="true">&times;</span>
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
                @click="hideRequest()"
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
import Vue from 'vue'
import BSN from 'bootstrap.native'
import { Component, Prop, Watch } from 'vue-property-decorator'
import PromiseModal from '~/plugins/modal/PromiseModal.vue'

@Component({})
export default class BaseModal extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  suppressWarnings!: boolean

  @Prop({
    type: String,
    default: '',
  })
  title!: string

  @Prop({
    type: Boolean,
    default: false,
  })
  hideFooter!: boolean

  @Prop({
    type: Function,
    default: () => () => {},
  })
  okCb!: () => void

  @Prop({
    type: Function,
    default: () => () => {},
  })
  cancelCb!: () => void

  @Prop({
    type: String,
    default: null,
    validator: (str) => ['ok', 'cancel'].includes(str),
  })
  autoFocus!: 'ok' | 'cancel'

  @Prop({
    type: Boolean,
    default: false,
  })
  okDisabled!: boolean

  @Prop({
    type: String,
    default: 'OK',
  })
  okText!: string

  @Prop({
    type: String,
    default: '',
    validator: (str) => ['', 'lg', 'sm'].includes(str),
  })
  size!: string

  @Prop({
    type: String,
    default: '',
  })
  form!: string

  modal!: BSN.Modal
  @Watch('$route.fullPath')
  onChangeFullPath() {
    if (!this.modal) return
    this.hideRequest()
  }

  mounted() {
    const modalEl = this.$refs.modal
    this.modal = new BSN.Modal(modalEl)
    modalEl.addEventListener('shown.bs.modal', this.shown)
    modalEl.addEventListener('hidden.bs.modal', this.hidden)
  }

  beforeDestroy() {
    const modalEl = this.$refs.modal
    modalEl.removeEventListener('shown.bs.modal', this.shown)
    modalEl.removeEventListener('hidden.bs.modal', this.hidden)
  }

  show(...arg: any[]) {
    this.modal.show()
    this.$emit('show', ...arg)
    this.$mousetrap.pause()
  }

  $refs!: {
    ok: HTMLButtonElement
    cancel: HTMLButtonElement
    modal: HTMLDivElement
    promiseModal: PromiseModal
  }

  shown() {
    if (this.autoFocus) this.$refs[this.autoFocus].focus()
    this.$emit('shown')
  }

  hideRequest() {
    // TODO
    const action = this.suppressWarnings ? 'ok' : 'cancel'
    return this.$refs.promiseModal.$emit(action)
  }

  hide() {
    if (!this.modal) return
    this.modal.hide()
  }

  hidden() {
    this.$mousetrap.unpause()
    if (!this.hideRequest()) this.$emit('hidden')
  }
}
</script>
