<template>
  <div id="help-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" >
        <div class="modal-header">
          <h5 class="modal-title">
            Keyboard shortcuts
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row flex-wrap">
            <div class="col-lg-4">
              <h6>Actions</h6>
              <dl class="row">
                <dt class="col-4">
                  <kbd>n</kbd>
                </dt>
                <dd class="col-8">
                  New Post
                </dd>
                <dt class="col-4">
                  <kbd>s</kbd>
                </dt>
                <dd class="col-8">
                  Star
                </dd>
                <dt class="col-4">
                  <kbd>r</kbd>
                </dt>
                <dd class="col-8">
                  Reply
                </dd>
                <dt class="col-4">
                  <kbd>p</kbd>
                </dt>
                <dd class="col-8">
                  Repost
                </dd>
                <dt class="col-4">
                  <kbd>Enter</kbd>
                </dt>
                <dd class="col-8">
                  Go to detail page
                </dd>
                <dt class="col-4">
                  <kbd><kbd>Ctrl</kbd>+<kbd>Enter</kbd></kbd>
                </dt>
                <dd class="col-8">
                  Send post
                </dd>
              </dl>
            </div>
            <div class="col-lg-4">
              <h6>Navigation</h6>
              <dl class="row">
                <dt class="col-4">
                  <kbd>j</kbd>
                </dt>
                <dd class="col-8">
                  Next post
                </dd>
                <dt class="col-4">
                  <kbd>k</kbd>
                </dt>
                <dd class="col-8">
                  Previous post
                </dd>
                <dt class="col-4">
                  <kbd>?</kbd>
                </dt>
                <dd class="col-8">
                  This help
                </dd>
              </dl>
            </div>
            <div class="col-lg-4">
              <h6>Streams</h6>
              <dl class="row">
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>h</kbd>
                </dt>
                <dd class="col-8">
                  Home
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>m</kbd>
                </dt>
                <dd class="col-8">
                  Mentions
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>i</kbd>
                </dt>
                <dd class="col-8">
                  Interactions
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>s</kbd>
                </dt>
                <dd class="col-8">
                  Stars
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>c</kbd>
                </dt>
                <dd class="col-8">
                  Conversations
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>p</kbd>
                </dt>
                <dd class="col-8">
                  Photos
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>t</kbd>
                </dt>
                <dd class="col-8">
                  Trending
                </dd>
                <dt class="col-4">
                  <kbd>g</kbd>&nbsp;<kbd>g</kbd>
                </dt>
                <dd class="col-8">
                  Global
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Mousetrap from '~plugins/mousetrap'
import bus from '~assets/js/bus'

export default {
  mounted() {
    $(this.$el).on('hidden.bs.modal', this.hidden)
    bus.$on('showHelpModal', this.showModal)
  },
  beforeDestroy() {
    bus.$off('showHelpModal', this.showModal)
  },
  methods: {
    showModal() {
      if(!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
      }
    },
    hidden() {
      Mousetrap.unpause()
    }
  }
}
</script>
<style scoped>
</style>