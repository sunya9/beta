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
                <dt class="col-3">
                  <kbd>n</kbd>
                </dt>
                <dd class="col-9">
                  New Post
                </dd>
                <dt class="col-3">
                  <kbd>s</kbd>
                </dt>
                <dd class="col-9">
                  Star
                </dd>
                <dt class="col-3">
                  <kbd>r</kbd>
                </dt>
                <dd class="col-9">
                  Reply
                </dd>
                <dt class="col-3">
                  <kbd>p</kbd>
                </dt>
                <dd class="col-9">
                  Repost
                </dd>
                <dt class="col-3">
                  <kbd>Enter</kbd>
                </dt>
                <dd class="col-9">
                  Go to detail page
                </dd>
              </dl>
            </div>
            <div class="col-lg-4">
              <h6>Navigation</h6>
              <dl class="row">
                <dt class="col-3">
                  <kbd>j</kbd>
                </dt>
                <dd class="col-9">
                  Next post
                </dd>
                <dt class="col-3">
                  <kbd>k</kbd>
                </dt>
                <dd class="col-9">
                  Previous post
                </dd>
                <dt class="col-3">
                  <kbd>?</kbd>
                </dt>
                <dd class="col-9">
                  This help
                </dd>
              </dl>
            </div>
            <div class="col-lg-4">
              <h6>Streams</h6>
              <dl class="row">
                <dt class="col-3">
                  <kbd>g</kbd><kbd>h</kbd>
                </dt>
                <dd class="col-9">
                  Home
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>m</kbd>
                </dt>
                <dd class="col-9">
                  Mentions
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>i</kbd>
                </dt>
                <dd class="col-9">
                  Interactions
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>s</kbd>
                </dt>
                <dd class="col-9">
                  Stars
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>c</kbd>
                </dt>
                <dd class="col-9">
                  Conversations
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>p</kbd>
                </dt>
                <dd class="col-9">
                  Photos
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>t</kbd>
                </dt>
                <dd class="col-9">
                  Trending
                </dd>
                <dt class="col-3">
                  <kbd>g</kbd><kbd>g</kbd>
                </dt>
                <dd class="col-9">
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

export default {
  mounted() {
    $(this.$el).on('hidden.bs.modal', this.hidden)
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