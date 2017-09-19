<template>
  <div id="reply-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content" v-if="show">
        <div class="modal-header">
          <h5 class="modal-title">
            {{title}}
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <post
              view-only
              :data="reply"
              v-if="reply"
              class="post pb-0" />
          </div>
          <div>
            <compose-inner
              :reply-target="reply"
              ref="compose"
              @post="dismiss"
               />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from '~/components/Post'
import ComposeInner from '~/components/ComposeInner'
import $ from 'jquery'
import bus from '~/assets/js/bus'
import Mousetrap from 'mousetrap'

export default {
  data () {
    return {
      show: false,
      reply: null
    }
  },
  mounted () {
    $(this.$el).on('hide.bs.modal', this.hide)
    $(this.$el).on('hidden.bs.modal', this.hidden)
    $(this.$el).on('shown.bs.modal', () => this.$refs.compose.setFocus())
    bus.$on('showPostModal', this.showModal)
  },
  computed: {
    title () {
      return this.reply
        ? `Reply to @${this.reply.user.username}`
        : 'Compose new post'
    }
  },
  beforeDestroy () {
    bus.$off('showPostModal', this.showModal)
  },
  methods: {
    hidden () {
      this.reply = null
      this.show = false
      Mousetrap.unpause()
    },
    showModal (post) {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        this.show = true
        this.reply = post || null
        $(this.$el).modal('show')
      }
    },
    dismiss () {
      if ($(this.$el).hasClass('show')) { $(this.$el).modal('hide') }
    }
  },
  components: {
    Post,
    ComposeInner
  }
}
</script>

<style scoped>
.modal-body {
  padding: 0;
}
.post {
  border: none;
  background: transparent;
}
</style>