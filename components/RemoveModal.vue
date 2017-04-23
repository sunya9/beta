<template>
  <div id="remove-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Remove post?
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Does you remove this post?</p>
          <post :data="vm.post" v-if="vm" view-only />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button
            class="btn btn-primary"
            @click="ok"
            data-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '~assets/js/bus'
import $ from 'jquery'
import Post from '~components/Post'
import Mousetrap from '~plugins/mousetrap'

export default {
  data() {
    return {
      vm: null
    }
  },
  mounted() {
    bus.$on('showRemoveModal', this.showModal)
    $(this.$el).on('hidden.bs.modal', this.hidden)
  },
  beforeDestroy() {
    bus.$off('showPostModal', this.showModal)
  },
  methods: {
    showModal(postVM) {
      if(!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
        this.vm = postVM
      }
    },
    ok() {
      this.vm.remove()
    },
    hidden() {
      Mousetrap.unpause()
      this.vm = null
    },
    dismiss() {
      if($(this.$el).hasClass('show'))
        $(this.$el).modal('hide')
    }
  },
  components: {
    Post
  }
}

</script>