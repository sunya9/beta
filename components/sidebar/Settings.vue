<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
  const menus = [
      {type: 'heading', label: 'App'},
      {
        label: 'Image upload',
        icon: 'fa-picture-o',
        url: '/settings'
      }
    ]
    return {
      menus
    }
  }
}
</script>