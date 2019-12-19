import Vue from 'vue'

export function elementIsHTMLElement(
  element: Vue | Element | Vue[] | Element[]
): element is Element {
  if ('length' in element) return false // not supported
  if (element instanceof Vue) {
    return false
  }
  if (element instanceof Element) {
    return true
  }
  return false
}
