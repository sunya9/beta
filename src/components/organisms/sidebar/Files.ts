import Vue from 'vue'
import Sidebar from './Sidebar.vue'
import { MenuItem } from '~/components/organisms/sidebar/MenuItem'

export function createFileMenu(): MenuItem[] {
  return [
    { type: 'heading', label: 'Files' },
    {
      label: 'Your files',
      icon: ['far', 'copy'],
      url: '/files',
    },
    {
      label: 'Images',
      icon: ['far', 'file-image'],
      url: '/files?kind=image',
    },
    {
      label: 'Audio',
      icon: ['far', 'file-audio'],
      url: '/files?kind=audio',
    },
    {
      label: 'Videos',
      icon: ['far', 'file-video'],
      url: '/files?kind=video',
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
