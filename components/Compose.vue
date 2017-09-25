<template>
  <div class="my-4 compose" v-if="user && !hidden">
    <div class="card">
      <compose-inner :reply-target="replyTarget" :initial-text="initialText" :focus="focus" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComposeInner from '~/components/ComposeInner'

export default {
  props: {
    initialText: {
      type: String,
      default: ''
    },
    focus: {
      type: [Boolean, Number, String, Array],
      default: false
    },
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
