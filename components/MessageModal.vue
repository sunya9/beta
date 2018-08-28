<template>
  <div id="message-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content" v-if="show">
        <div class="modal-header">
          <h5 class="modal-title">
            Create a room
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a
                id="create-private-room-tab-label"
                data-toggle="tab"
                role="tab"
                aria-controls="create-private-room-tab"
                aria-selected="true"
                href="#create-private-room-tab"
                class="nav-link active"
              >
                private
              </a>
            </li>
            <li class="nav-item">
              <a
                id="create-public-room-tab-label"
                data-toggle="tab"
                role="tab"
                aria-controls="create-public-room-tab"
                aria-selected="false"
                href="#create-public-room-tab"
                class="nav-link"
              >
                public
              </a>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <div
            class="tab-pane fade show active"
            id="create-private-room-tab"
            role="tabpanel"
            aria-labelledby="create-private-room-tab-label"
          >
            <message-compose
              class="border-0"
              create-channel-mode
              @submit="dismiss"
              @foundChannel="dismiss"
            />
          </div>
          <div
            class="tab-pane fade"
            id="create-public-room-tab"
            role="tabpanel"
            aria-labelledby="create-public-room-tab-label"
          >
            <channel-compose
              class="border-0"
              @submit="dismiss"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import bus from '~/assets/js/bus'
import Mousetrap from 'mousetrap'
import MessageCompose from '~/components/MessageCompose'
import ChannelCompose from '~/components/ChannelCompose'

export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    $(this.$el).on('hidden.bs.modal', () => this.hidden())
    $(this.$el).on('shown.bs.modal', () => this.setFocus())
    bus.$on('showPostModal', this.showModal)
  },
  computed: {},
  beforeDestroy() {
    bus.$off('showPostModal', this.showModal)
  },
  methods: {
    hidden() {
      this.show = false
      Mousetrap.unpause()
    },
    setFocus() {
      $('.tab-pane.active', this.$el)
        .find('textarea, input')
        .first()
        .focus()
    },
    async showModal(isPrivate) {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        this.show = true
        await this.$nextTick()
        $(this.$el).modal('show')
        $(`#create-${isPrivate ? 'private' : 'public'}-room-tab-label`).tab(
          'show'
        )
      }
    },
    dismiss() {
      if ($(this.$el).hasClass('show')) {
        $(this.$el).modal('hide')
      }
    }
  },
  components: {
    MessageCompose,
    ChannelCompose
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.nav-link.active {
  background: $modal-content-bg;
  border-bottom-color: $modal-content-bg;
}
</style>
