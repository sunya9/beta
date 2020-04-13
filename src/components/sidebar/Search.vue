<script lang="ts">
import Vue from 'vue'
import Sidebar from './Sidebar.vue'

export default Vue.extend({
  extends: Sidebar,
  computed: {
    menus() {
      const q = this.$route.query.q as string
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
    },
  },
})
</script>
