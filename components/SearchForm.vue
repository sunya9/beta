<template>
  <form
    class="form-inline search-form d-inline-flex align-items-center"
    @submit.prevent="search"
  >
    <input
      v-model="text"
      type="search"
      class="form-control"
      placeholder="keyword search"
    >
    <button
      :disabled="!text"
      type="submit"
      class="btn btn-link text-dark"
    >
      <font-awesome-icon icon="search" />
    </button>
  </form>
</template>
<script>
export default {
  data() {
    return {
      text: this.$route.query.q
    }
  },
  watch: {
    '$route.query.q'(text) {
      this.text = text
    }
  },
  methods: {
    search(e) {
      if (!this.text) return e.preventDefault()
      const query = {
        q: this.text
      }
      const [search, type] = this.$route.name.split('-')
      const searchType = search === 'search' ? type : 'posts'
      this.$router.push({
        path: `/search/${searchType}`,
        query
      })
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
  input[type='search'] {
    padding-right: 36px;
    background: $grayLightest;
    &:focus {
      background: white;
    }
    margin-right: -36px;
  }
  @include media-breakpoint-down(sm) {
    position: relative;
    z-index: 1;
    margin: 0 calc((100% - 100vw) / 2) -1px;
    left: 0;
    width: 100%;
    margin: 0 0 -1px;
    top: 0;
    input[type='search'] {
      display: block;
      border-color: $grayLighter;
      border-left: none;
      border-right: none;
      width: 100%;
      box-sizing: content-box;
      margin: 0 calc((100% - 100vw) / 2);
      padding-left: calc((100vw - 100%) / 2);
      padding-right: calc((100vw - 100%) / 2 + 36px);
    }
    button {
      position: absolute;
      right: 0;
    }
  }
}
</style>
