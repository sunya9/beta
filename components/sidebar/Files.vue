<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const menus = [
      { type: 'heading', label: 'Files' },
      {
        label: 'Your files',
        icon: ['far', 'copy'],
        url: '/files'
      }
    ]
    return {
      menus
    }
  }
}
</script>
