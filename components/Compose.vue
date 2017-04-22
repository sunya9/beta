<template>
  <div class="my-4 compose" v-if="user && !hidden">
    <div class="card">
      <div>
        <compose-inner :reply-target="replyTarget" :initial-text="initialText" :focus="focus" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '~plugins/api'
import { mapState } from 'vuex'
import ComposeInner from '~components/ComposeInner'
import bus from '~assets/js/bus'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: Boolean,
    thread: Boolean,
    replyTarget: Object
  },
  data() {
    return {
      hidden: false
    }
  },
  mounted() {
    this.hidden = this.thread
  },
  computed: mapState(['user']),
  components: {
    ComposeInner
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.compose {
  @include no-gutter-xs
}
</style>