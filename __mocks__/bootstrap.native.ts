function noop() {}
const Collapse = noop
const Popover = noop

const toggleBoolStr = (b: string | null) => !(b === 'true')

class Dropdown {
  el: HTMLElement
  btn: HTMLElement | null = null
  constructor(dropdownEl: HTMLElement) {
    this.el = dropdownEl
    if (!this.el) return
    this.btn = this.el.querySelector('[data-toggle="dropdown"]')
    if (!this.btn) return
    this.btn.addEventListener('click', this.toggle.bind(this))
  }

  toggle() {
    const b = this.el.getAttribute('aria-expanded')
    this.el.setAttribute('aria-expanded', `${toggleBoolStr(b)}`)
  }

  show() {}
}

class Modal {
  el: HTMLElement
  constructor(el: HTMLElement) {
    this.el = el
  }

  show() {}
  hide() {}
}
const Tab = noop

export default {
  Collapse,
  Popover,
  Dropdown,
  Modal,
  Tab,
}
