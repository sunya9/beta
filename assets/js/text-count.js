import stringLength from 'string-length'
import _ from 'lodash'

export default {
  data() {
    return {
      text: '',
      textLength: 0
    }
  },
  watch: {
    text: {
      handler: 'debounceCalcTextLength',
      immediate: true
    }
  },
  methods: {
    debounceCalcTextLength: _.debounce(calcTextLength, 300),
    calcTextLength
  }
}

function calcTextLength(text) {
  // http://stackoverflow.com/a/32382702
  const stripMarked = text.replace(
    /(\[((?:\[[^\]]*\]|[^[\]])*)\]\([ \t]*((?:\([^)]*\)|[^()\s])*?)([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g,
    '[$2]'
  )
  const length = stringLength(stripMarked)
  this.textLength = length
}
