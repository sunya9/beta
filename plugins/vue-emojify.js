import emojione from 'emojione'
import Vue from 'vue'

Vue.directive('emojify', {
  bind(el) {
    el.innerHTML = emojione.toImage(el.innerHTML)
  }
})
