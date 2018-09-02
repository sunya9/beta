import bus from '~/assets/js/bus'
import Sidebar from './Sidebar'

function createMenus({ user, self }) {
  return [
    {
      type: 'heading',
      label: 'Beta',
      hidden: !user
    },
    {
      label: 'Your Stream',
      icon: 'home',
      url: '/',
      hidden: !user
    },
    {
      label: 'Mentions',
      icon: ['far', 'hand-point-right'],
      url: '/mentions',
      hidden: !user
    },
    {
      label: 'Interactions',
      icon: 'exchange-alt',
      url: '/interactions',
      hidden: !user
    },
    {
      label: 'Stars',
      icon: 'star',
      url: '/stars',
      hidden: !user
    },
    {
      type: 'heading',
      label: 'Explore',
      hidden: !user
    },
    {
      label: 'Conversations',
      url: '/conversations',
      icon: 'comments',
      hidden: !user
    },
    {
      label: 'Missed Conversations',
      url: '/missed-conversations',
      icon: 'comment',
      hidden: !user
    },
    {
      label: 'Newcomers',
      url: '/newcomers',
      icon: 'user-plus',
      hidden: !user
    },
    {
      label: 'Photos',
      url: '/photos',
      icon: 'camera',
      hidden: !user
    },
    {
      label: 'Trending',
      url: '/trending',
      icon: 'chart-line',
      hidden: !user
    },
    {
      label: 'Global',
      url: '/global',
      icon: 'globe'
    },
    {
      type: 'heading',
      label: 'Other'
    },
    {
      label: 'About',
      url: '/about',
      icon: 'info-circle'
    },
    {
      label: 'Beta on GitHub',
      url: 'https://github.com/sunya9/beta',
      normal: true,
      icon: ['fab', 'github']
    },
    {
      label: 'Keyboard shortcuts',
      click: self.showHelpModal,
      normal: true,
      hidden: !user,
      icon: ['far', 'keyboard']
    }
  ]
}

export default {
  extends: Sidebar,
  name: 'AppSidebar',
  data() {
    const { user } = this.$store.getters
    const menus = createMenus({
      self: this,
      user
    })
    return {
      menus
    }
  },
  methods: {
    showHelpModal() {
      bus.$emit('showHelpModal')
    }
  }
}
