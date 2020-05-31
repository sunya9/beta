import { configure, addDecorator } from '@storybook/vue'
import { withScreenshot } from 'storycap'

import Vue from 'vue'
import Vuex from 'vuex'
import '../src/assets/css/main.scss'
import './css/main.css'

Vue.use(Vuex)

addDecorator(withScreenshot())
