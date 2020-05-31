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

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

import '../src/assets/css/main.scss'
import './css/main.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
Vue.use(Vuex)
Vue.use(Router)

// font awesome
config.autoAddCss = false

library.add(fas)
library.add(far)
library.add(fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('nuxt-link', {
  functional: true,
  render: (h, { data, children }) => h('router-link', data, children),
})
addDecorator(withScreenshot())

dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

dayjs.updateLocale('en', {
  relativeTime: {
    ...dayjs.Ls.en.relativeTime,
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
  },
})

Vue.prototype.$dayjs = dayjs
