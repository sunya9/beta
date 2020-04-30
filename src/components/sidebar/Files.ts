import Vue from 'vue'
import Sidebar from './Sidebar.vue'
import { MenuItem } from '~/components/sidebar/MenuItem'

export function createFileMenu(): MenuItem[] {
  return [
    { type: 'heading', label: 'Files' },
    {
      label: 'Your files',
      icon: ['far', 'copy'],
      url: '/files',
    },
  ]
}

export default Vue.extend({
  extends: Sidebar,
  computed: {
    menus() {
      return createFileMenu()
    },
  },
})
