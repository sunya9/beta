<template>
  <div>
    <h3 class="card-title">Display</h3>
    <custom-checkbox v-model="square">
      Square avatars
    </custom-checkbox>
  </div>
</template>

<script>
import CustomCheckbox from '../CustomCheckbox'

export default {
  data() {
    return {
      square: this.$store.state.square_avatars,
      error: null
    }
  },
  watch: {
    square(newVal) {
      this.$store.commit('SET_SQUARE', newVal)
      localStorage.square_avatars = newVal
    }
  },
  methods: {
    
  },
  components: {
    CustomCheckbox
  }
}
</script>

