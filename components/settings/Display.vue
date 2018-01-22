<template>
  <div>
    <h3 class="card-title">Display</h3>
    <custom-checkbox v-model="square">
      Square avatars
    </custom-checkbox>
    <custom-checkbox v-model="theme">
      Dark theme (will refresh to take effect)
    </custom-checkbox>
  </div>
</template>

<script>
import CustomCheckbox from '../CustomCheckbox'

export default {
  data() {
    return {
      square: false,
      theme: false,
      error: null
    }
  },
  mounted() {
    this.square = localStorage.getItem(`square_avatars`) === 'true'
    this.theme = localStorage.getItem(`dark_theme`) === 'true'
  },
  watch: {
    square(newVal) {
      localStorage.setItem('square_avatars', newVal);
    },
    theme(newVal) {
      if ((newVal && localStorage.getItem(`dark_theme`) !== 'true') || (!newVal && localStorage.getItem(`dark_theme`) === 'true')) {
        localStorage.setItem('dark_theme', newVal);
        window.location.reload();
      }
    }
  },
  methods: {
    
  },
  components: {
    CustomCheckbox
  }
}
</script>

