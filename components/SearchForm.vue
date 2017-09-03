<template>
  <form @submit.prevent="search" class="form-inline ml-sm-auto mr-sm-5 search-form d-inline-flex align-items-center">
    <input type="search" class="form-control" placeholder="search" v-model="text">
    <button
      type="submit"
      class="btn btn-link text-dark"
      :disabled="!text">
      <i class="fa fa-search"></i>
    </button>
  </form>
</template>
<script>
import qs from 'querystring'
export default {
  data () {
    return {
      text: this.$route.query.q
    }
  },
  watch: {
    '$route.query.q' (text) {
      this.text = text
    }
  },
  methods: {
    search (e) {
      if (!this.text) return e.preventDefault()
      const query = {
        q: this.text
      }
      const [, type] = this.$route.name.split('-')
      this.$router.push(`/search/${type || 'posts'}?${qs.stringify(query)}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/adn_base_variables';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';

.search-form {
  position: relative;
  z-index: 1;
  input[type='search'] {
    background: $grayLightest;
    border-color: $grayLighter;
    padding-right: 36px;
    &:focus {
      background: white;
    }
    width: 100%;
  }
  button {
    position: absolute;
    right: 0;
  }
  @include media-breakpoint-down(xs) {
    left: 0;
    width: calc(100% + #{$grid-gutter-width} * 2);
    margin: 0 (-$grid-gutter-width / 2) -1px;
    top: 0;
    order: 4;
    input[type='search'] {
      border-left: none;
      border-right: none;
      padding-right: calc(#{$grid-gutter-width} / 2 + 36px);
      padding-left: $grid-gutter-width / 2;
    }
    button {
      right: $grid-gutter-width / 2;
    }
  }
}
</style>