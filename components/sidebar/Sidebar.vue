<template>
  <div>
    <div class="list-group">
      <template v-for="menu in menus" v-if="'hidden' in menu ? !menu.hidden : true">
        <span
          :key="menu.label"
          class="heading list-group-item pt-4 pl-0 border-left-0 border-top-0 h5 text-uppercase"
          v-if="menu.type === 'heading'">
          {{menu.label}}
        </span>
        <a
          :key="menu.label"
          :class="itemClass"
          :href="menu.url"
          v-else-if="menu.normal && menu.url">
          <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
          {{menu.label}}
        </a>
        <a
          :key="menu.label"
          href="#"
          :class="itemClass"
          @click.prevent="menu.click"
          v-else-if="menu.click && menu.click">
          <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
          {{menu.label}}
        </a>
        <nuxt-link
          :key="menu.label"
          :to="menu.url"
          class="d-inline-flex justify-content-between flex-nowrap text-overflow"
          :class="[{
            active: menu.active && typeof menu.active === 'function'
              ? menu.active()
              : menu.active || active(menu.url)
          }, itemClass]"
          data-toggle="collapse" data-target="#navbarSupportedContent.show"
          exact
          v-else>
          <span>
            <i class="fa fa-fw" :class="menu.icon"></i>&nbsp;
            {{menu.label}}
            <!-- <span class="badge badge-important pull-right">{{ badge }}</span>-->
          </span>
          <span v-show="active(menu.url)">
            <i class="fa fa-chevron-right"></i>
          </span>
        </nuxt-link>
      </template>
    </div>
    <div class="py-3">
      <a
        class="text-muted"
        :href="`${npm_package_homepage}/releases/tag/v${npm_package_version}`"
        target="_new">
        <small>{{npm_package_version}} last modified: {{last_modified}}</small>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  data() {
    // Vue might recgnize process.env as strings and replace.
    // So, unable to use destructuring assignment because occurred errors.
    return {
      itemClass: 'list-group-item list-group-item-action border-left-0 border-bottom-0',
      npm_package_version: process.env.npm_package_version,
      npm_package_homepage: process.env.npm_package_homepage,
      last_modified: moment(process.env.last_modified).format('YYYY-MM-DD')
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
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
