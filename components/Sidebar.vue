<template>
  <div class="show collapse fixed-top sticky-top mb-5" style="top: 100px" id="navbarSupportedContent">
    <ul class="list-group" v-if="user">
      <li class="list-group-item border-left-0 border-top-0">BETA</li>
      <nuxt-link :to="stream.url"
        class="justify-content-between list-group-item list-group-item-action border-left-0 border-bottom-0"
        :key="stream.url"
        v-for="stream in streams" exact>
        <span>
          <i class="fa fa-fw" :class="stream.icon"></i>&nbsp;
          {{stream.label}}
          <!-- <span class="badge badge-important pull-right">{{ badge }}</span>-->
        </span>
        <i class="fa fa-chevron-right" v-show="active(stream.url)"></i>
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      streams: [
        { label: 'stream', icon: 'fa-home', title: 'Your Stream', url: '/'},
        { label: 'mentions', icon: 'fa-hand-o-right', title: 'Mentions', url: '/mentions'},
        { label: 'interactions', icon: 'fa-exchange', title: 'Interactions', url: '/interactions'},
        { label: 'stars', icon: 'fa-star', title: 'Stars', url: '/stars'}
      ],
      explores: []
      // streams: ['Stream', 'Mentions', 'Interactions', 'Global', 'Messages']
    }
  },
  computed: mapState([
    'user'
  ]),
  methods: {
    active(url) {
      return this.$route.fullPath === url ? 'active' : ''
    }
  }
}
</script>