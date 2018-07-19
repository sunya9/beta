import bus from '~/assets/js/bus'
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  name: 'AppSidebar',
  data() {
    const user = this.$store.state.user
    const menus = [
      { type: 'heading', label: 'Beta', hidden: !user },
      {
        label: 'Your Stream',
        icon: 'fa-home',
        url: '/',
        hidden: !user
      },
      {
        label: 'Mentions',
        icon: 'fa-hand-o-right',
        url: '/mentions',
        hidden: !user
      },
      {
        label: 'Interactions',
        icon: 'fa-exchange',
        url: '/interactions',
        hidden: !user
      },
      {
        label: 'Stars',
        icon: 'fa-star',
        url: '/stars',
        hidden: !user
      },
      { type: 'heading', label: 'Explore', hidden: !user },
      {
        label: 'Conversations',
        url: '/conversations',
        icon: 'fa-comments',
        hidden: !user
      },
      {
        label: 'Missed Conversations',
        url: '/missed-conversations',
        icon: 'fa-comment',
        hidden: !user
      },
      {
        label: 'Newcomers',
        url: '/newcomers',
        icon: 'fa-user-plus',
        hidden: !user
      },
      {
        label: 'Photos',
        url: '/photos',
        icon: 'fa-camera',
        hidden: !user
      },
      {
        label: 'Trending',
        url: '/trending',
        icon: 'fa-line-chart',
        hidden: !user
      },
      {
        label: 'Global',
        url: '/global',
        icon: 'fa-globe'
      },
      { type: 'heading', label: 'Other' },
      {
        label: 'About',
        url: '/about',
        icon: 'fa-info-circle'
      },
      {
        label: 'Beta on Github',
        url: 'https://github.com/sunya9/beta',
        normal: true,
        icon: 'fa-github'
      },
      {
        label: 'Keyboard shortcuts',
        click: this.showHelpModal,
        normal: true,
        icon: 'fa-keyboard-o'
      }
    ]
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
