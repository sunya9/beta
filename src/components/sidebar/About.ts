import Vue from 'vue'
import Sidebar from './Sidebar.vue'

export function createAboutMenu(self: Vue) {
  const { user } = self.$store.getters
  return [
    { type: 'heading', label: 'About' },
    {
      label: 'Beta',
      icon: 'info-circle',
      url: '/about',
    },
    {
      label: 'Stats',
      icon: 'chart-bar',
      url: '/about/stats',
      hidden: !user,
    },
    { type: 'heading', label: 'Resources' },
    {
      label: 'Bookmarklet',
      icon: 'bookmark',
      url: '/about/bookmarklet',
    },
  ]
}
export default Vue.extend({
  extends: Sidebar,
  computed: {
    menus() {
      return createAboutMenu(this)
    },
  },
})
