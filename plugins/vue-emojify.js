import Vue from 'vue'
import twemoji from 'twemoji'

Vue.directive('emojify', {
  bind(el) {
    el.innerHTML = twemoji.parse(el.innerHTML)
  }
})
