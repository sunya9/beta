<template>

</template>


<script>
import { mapState } from 'vuex'

export default {
  async asyncData(ctx) {
    var prefs = {'square_avatars': ctx.store.state.square_avatars};

  },
  mounted() {
    
  }
}
</script>