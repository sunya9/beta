<template>
  <div>
    <div class="list-group pb-3">
      <template
        v-for="menu in menus"
        v-if="'hidden' in menu ? !menu.hidden : true">
        <span
          v-if="menu.type === 'heading'"
          :key="menu.label"
          class="heading list-group-item pt-4 pl-0 border-left-0 border-top-0 h5 text-uppercase">
          {{ menu.label }}
        </span>
        <a
          v-else-if="menu.normal && menu.url"
          :key="menu.label"
          :class="itemClass"
          :href="menu.url">
          <span>
            <font-awesome-icon
              :icon="menu.icon"
              fixed-width
              class="mr-2"
            />
            <span>{{ menu.label }}</span>
            <font-awesome-icon
              icon="external-link-alt"
              class="ml-2"
            />
          </span>
        </a>
        <a
          v-else-if="menu.click"
          :key="menu.label"
          :class="itemClass"
          href="#"
          @click.prevent="menu.click">
          <font-awesome-icon
            :icon="menu.icon"
            fixed-width
            class="mr-2"
          />
          <span>{{ menu.label }}</span>
        </a>
        <nuxt-link
          v-else
          :key="menu.label"
          :to="menu.url"
          :class="[{
            active: menu.active && typeof menu.active === 'function'
              ? menu.active()
              : menu.active || active(menu.url)
          }, itemClass]"
          class="d-inline-flex justify-content-between flex-nowrap text-overflow"
          exact>
          <span>
            <font-awesome-icon
              :icon="menu.icon"
              fixed-width
              class="mr-2"
            />
            <span>{{ menu.label }}</span>
            <!-- <span class="badge badge-important pull-right">{{ badge }}</span>-->
          </span>
          <span v-show="active(menu.url)">
            <font-awesome-icon icon="chevron-right"/>
          </span>
        </nuxt-link>
      </template>
    </div>
    <div
      v-if="$options.name === 'AppSidebar'"
      class="pb-3">
      <a
        :href="`${npm_package_homepage}/releases/tag/v${npm_package_version}`"
        class="text-muted"
        target="_new">
        <small>{{ npm_package_version }} last modified: {{ last_modified }}</small>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  props: {
    narrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // Vue might recgnize process.env as strings and replace.
    // So, unable to use destructuring assignment because occurred errors.
    return {
      itemClass:
        'list-group-item list-group-item-action border-left-0 border-bottom-0',
      npm_package_version: process.env.npm_package_version,
      npm_package_homepage: process.env.npm_package_homepage,
      last_modified: moment(process.env.last_modified).format('YYYY-MM-DD')
    }
  },
  computed: mapGetters(['user']),
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
