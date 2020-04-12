import Vue from 'vue'
// import TextCountWorker from '~/assets/ts/workers/text-count.worker'
import stringLength from 'string-length'
import _ from 'lodash'
import { Component, Watch } from 'nuxt-property-decorator'

@Component({})
export default class TextCount extends Vue {
  text = ''
  textLength = 0

  @Watch('text', { immediate: true })
  debounceCalcTextLength = _.debounce(this.calcTextLength, 300)

  calcTextLength() {
    // http://stackoverflow.com/a/32382702
    const stripMarked = this.text.replace(
      /(\[((?:\[[^\]]*\]|[^[\]])*)\]\([ \t]*((?:\([^)]*\)|[^()\s])*?)([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g,
      '[$2]'
    )
    const length = stringLength(stripMarked)
    this.textLength = length
    return length
  }
}
