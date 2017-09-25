<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const menus = [
      {type: 'heading', label: 'Files'},
      {
        label: 'All',
        icon: 'fa-files-o',
        url: '/files'
      }
    ]
    return {
      menus
    }
  }
}
</script>