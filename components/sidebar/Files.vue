<script lang="ts">
import Vue from 'vue'
import Sidebar from './Sidebar.vue'

export default Vue.extend({
  extends: Sidebar,
  data() {
    const menus = [
      { type: 'heading', label: 'Files' },
      {
        label: 'Your files',
        icon: ['far', 'copy'],
        url: '/files',
      },
    ]
    return {
      menus,
    }
  },
})
</script>
