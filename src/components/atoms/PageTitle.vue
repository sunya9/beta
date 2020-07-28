<template>
  <h3
    v-if="!notLoginIndex"
    :class="{
      'justify-content-between mb-4': selectedDropdownItem,
      'justify-content-end': !selectedDropdownItem,
    }"
    class="d-flex align-items-center mb-0"
  >
    <div v-if="selectedDropdownItem" class="d-flex align-items-center">
      <div
        class="d-block bg-primary text-center rounded-circle text-white border-white mr-1 icon"
      >
        <font-awesome-icon :icon="selectedDropdownItem.icon" fixed-width />
      </div>
      {{ selectedDropdownItem.label }}
    </div>

    <div
      v-if="menusWithMeta.menus.length && !menusWithMeta.isDefault"
      class="ml-3 d-md-none h4 mb-1 mt-1"
    >
      <a
        data-toggle="collapse"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle local navigation"
        data-target="#navbarSupportedContent"
      >
        <font-awesome-icon icon="bars" size="lg" />
      </a>
    </div>
  </h3>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { getMenusWithMeta, MenuItem } from '../sidebar/MenuItem'

@Component({})
export default class PageTitle extends Vue {
  get notLoginIndex(): boolean {
    return !this.$auth.loggedIn && this.$route.name === 'index'
  }

  get menusWithMeta() {
    return getMenusWithMeta(this)
  }

  get dropdownItems(): MenuItem[] {
    return this.menusWithMeta.menus
  }

  get selectedDropdownItem(): MenuItem | null {
    return (
      this.dropdownItems.find((item) => item.url === this.$route.path) || null
    )
  }
}
</script>
<style lang="scss" scoped>
.icon {
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  vertical-align: middle;
  overflow: hidden;
  border: 3px double white;
  > svg {
    vertical-align: -0.25rem;
  }
}
</style>
