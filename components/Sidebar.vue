<template>
  <div class="list-group">
    <template v-if="user">
      <span class="heading list-group-item pt-4 pl-0 border-left-0 border-top-0 h5 text-uppercase">Beta</span>
      <nuxt-link :to="stream.url"
        class="justify-content-between list-group-item list-group-item-action border-left-0 border-bottom-0"
        :key="stream.url"
        data-toggle="collapse" data-target="#navbarSupportedContent.show"
        :class="active(stream.url) ? 'active' : ''"
        v-for="stream in streams" exact>
        <span>
          <i class="fa fa-fw" :class="stream.icon"></i>&nbsp;
          {{stream.label}}
          <!-- <span class="badge badge-important pull-right">{{ badge }}</span>-->
        </span>
        <i class="fa fa-chevron-right" v-show="active(stream.url)"></i>
      </nuxt-link>
    </template>
    <span
      :class="{
        'pt-4': !user,
        'pt-5': user
      }"
      class="heading list-group-item pl-0 border-left-0 border-top-0 h5 text-uppercase">Explore</span>
    <nuxt-link :to="explore.url"
      class="justify-content-between list-group-item list-group-item-action border-left-0 border-bottom-0"
      :class="active(explore.url) ? 'active' : ''"
      :key="explore.url"
      data-toggle="collapse" data-target="#navbarSupportedContent.show"
      v-for="explore in explores" exact>
      <span>
        <i class="fa fa-fw" :class="explore.icon"></i>&nbsp;
        {{explore.label}}
      </span>
      <i class="fa fa-chevron-right" v-show="active(explore.url)"></i>
    </nuxt-link>
    <span class="heading list-group-item pl-0 pt-5 border-left-0 border-top-0 h5 text-uppercase">Other</span>        
    <a href="https://github.com/sunya9/beta"
      class="border-left-0 border-bottom-0 list-group-item list-group-item-action">
      <i class="fa fa-fw fa-github"></i>&nbsp;
      Beta on Github
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      streams: [
        { label: 'Your Stream', icon: 'fa-home', title: 'Your Stream', url: '/'},
        { label: 'Mentions', icon: 'fa-hand-o-right', title: 'Mentions', url: '/mentions'},
        { label: 'Interactions', icon: 'fa-exchange', title: 'Interactions', url: '/interactions'},
        { label: 'Stars', icon: 'fa-star', title: 'Stars', url: '/stars'}
      ],
      explores: [
        {
          label: 'Conversations',
          title: 'Conversations',
          url: '/conversations',
          icon: 'fa-comments'
        }, {
          label: 'Photos',
          title: 'Photos',
          url: '/photos',
          icon: 'fa-camera'
        }, {
          label: 'Trending',
          title: 'Trending',
          url: '/trending',
          icon: 'fa-line-chart'
        }, {
          label: 'Global',
          title: 'Global',
          url: '/global',
          icon: 'fa-globe'
        },
      ]
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
<style scoped lang="scss">
@import '~assets/css/override';

.list-group-item:not(.active) {
  background: transparent;
}
.list-group-item:hover:not(.active):not(.h5) {
  background: $list-group-hover-bg;
}
.list-group-item {
  border-top-color: $grayLightest;
}
.heading {
  border-bottom-color: $grayLighter;
  margin-bottom: 0;
}
.heading + .list-group-item {
  border-top: none;
}
</style>