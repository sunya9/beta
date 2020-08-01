import Vue from 'vue'
import Sidebar from './Sidebar.vue'
import { MenuItem } from '~/components/organisms/sidebar/MenuItem'

export function createSearchMenu(self: Vue): MenuItem[] {
  const q = self.$route.query.q as string
  return [
    { type: 'heading', label: 'Search' },
    {
      label: 'Posts',
      icon: 'list',
      url: `/search/posts?q=${encodeURIComponent(q)}`,
    },
    {
      label: 'Users',
      icon: 'users',
      url: `/search/users?q=${encodeURIComponent(q)}`,
    },
  ]
}

const component = Vue.extend({
  extends: Sidebar,
  computed: {
    menus() {
      return createSearchMenu(this)
    },
  },
})

export default component
