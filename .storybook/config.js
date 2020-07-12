import { configure, addDecorator } from '@storybook/vue'
import { withScreenshot } from 'storycap'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { directive } from 'vue-on-click-outside'
import ClientOnly from 'vue-client-only'
import dayjs from 'dayjs'
import '~/plugins/modal'
import '../src/assets/css/main.scss'
import './css/main.css'
import '~/plugins/dayjs'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Mousetrap from 'mousetrap'
import '~/plugins/emojify'
import { BootstrapVue } from 'bootstrap-vue'
import 'reflect-metadata'
require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

Vue.use(Vuex)
const router = new Router()
Vue.use(Router)

// font awesome
config.autoAddCss = false

library.add(fas)
library.add(far)
library.add(fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
const nuxtLink = {
  functional: true,
  router,
  render: (h, { data, children }) => h('router-link', data, children),
}
Vue.component('nuxt-link', nuxtLink)
addDecorator(withScreenshot())

Vue.directive('on-click-outside', directive)
Vue.component('client-only', ClientOnly)
Vue.prototype.$dayjs = dayjs

Vue.prototype.$mousetrap = Mousetrap
Vue.use(BootstrapVue)
