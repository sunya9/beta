import Vue from 'vue'
import Router from 'vue-router'
import HelpModal from './HelpModal.vue'

export default { title: 'HelpModal' }

function base() {
  return {
    components: { HelpModal },
  }
}

const router = new Router()

export const normal = () =>
  Vue.extend({
    ...base(),
    mounted() {
      this.$modal.show('help-modal')
    },
    beforeDestroy() {
      this.$modal.ok('help-modal')
    },
    router,
    template: '<help-modal class="show" />',
  })
