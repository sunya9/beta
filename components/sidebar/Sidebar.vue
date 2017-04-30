<template>
  <div class="list-group">
    <template v-for="menu in menus">
      <span
        class="heading list-group-item pt-4 pl-0 border-left-0 border-top-0 h5 text-uppercase"
        v-if="menu.type === 'heading'">
        {{menu.label}}
      </span>
      <a
        :class="itemClass"
        :href="menu.url"
        v-else-if="menu.normal && menu.url">
        <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
        {{menu.label}}
      </a>
      <a
        href="#"
        :class="itemClass"
        @click.prevent="menu.click"
        v-else-if="menu.click && menu.click">
        <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
        {{menu.label}}
      </a>
      <nuxt-link
        :to="menu.url"
        class="justify-content-between"
        :class="[{
          active: active(menu.url)
        }, itemClass]"
        data-toggle="collapse" data-target="#navbarSupportedContent.show"
        exact
        v-else>
        <span>
          <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
          {{menu.label}}
          <!-- <span class="badge badge-important pull-right">{{ badge }}</span>-->
        </span>
      </nuxt-link>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      itemClass: 'list-group-item list-group-item-action border-left-0 border-bottom-0'
    }
  },
  computed: mapState([
    'user'
  ]),
  methods: {
    active(url) {
      return this.$route.fullPath === url ? 'active' : ''
    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.list-group-item:not(.active) {
  background: transparent;
}
.list-group-item:hover:not(.active):not(.h5) {
  background: $list-group-hover-bg;
}
.list-group-item {
  border-top-color: $grayLightest;
}
.heading {
  border-bottom-color: $grayLighter;
  margin-bottom: 0;
}
.heading + .list-group-item {
  border-top: none;
}
</style>