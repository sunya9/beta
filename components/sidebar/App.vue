<script>
import { mapState } from 'vuex'
import bus from '~assets/js/bus'
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const menus = [
      {type: 'heading', label: 'Beta', hidden: !this.user},
      {
        label: 'Your Stream',
        icon: 'fa-home',
        url: '/',
        hidden: !this.user
      }, {
        label: 'Mentions',
        icon: 'fa-hand-o-right',
        url: '/mentions',
        hidden: !this.user
      }, {
        label: 'Interactions',
        icon: 'fa-exchange',
        url: '/interactions',
        hidden: !this.user
      }, {
        label: 'Stars',
        icon: 'fa-star',
        url: '/stars',
        hidden: !this.user
      },
      {type: 'heading', label: 'Explore'},
      {
        label: 'Conversations',
        url: '/conversations',
        icon: 'fa-comments'
      }, {
        label: 'Photos',
        url: '/photos',
        icon: 'fa-camera'
      }, {
        label: 'Trending',
        url: '/trending',
        icon: 'fa-line-chart'
      }, {
        label: 'Global',
        url: '/global',
        icon: 'fa-globe'
      },
      {type: 'heading', label: 'Other'},
      {
        label: 'Beta on Github',
        url: 'https://github.com/sunya9/beta',
        normal: true,
        icon: 'fa-github'
      }, {
        label: 'Keyboard shortcuts',
        click: this.showHelpModal,
        normal: true,
        icon: 'fa-keyboard-o'
      },
    ]
    return {
      menus
    }
  },
  computed: mapState(['user']),
  methods: {
    showHelpModal() {
      bus.$emit('showHelpModal')
    }
  }
}
</script>