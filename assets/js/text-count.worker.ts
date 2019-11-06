import stringLength from 'string-length'
import _ from 'lodash'

function calcTextLength(text: string) {
  // http://stackoverflow.com/a/32382702
  const stripMarked = text.replace(
    /(\[((?:\[[^\]]*\]|[^[\]])*)\]\([ \t]*((?:\([^)]*\)|[^()\s])*?)([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g,
    '[$2]'
  )
  const length = stringLength(stripMarked)
  // this.textLength = length
  return length
}

function calc(text: string) {
  const length = calcTextLength(text)
  self.postMessage(length)
}

const calcDebounce = _.debounce(calc, 300)

self.addEventListener('message', (e: MessageEvent) => {
  setTimeout(() => {
    const text = e.data as string
    calcDebounce(text)
  }, 0)
})

// work around
export default null as any
