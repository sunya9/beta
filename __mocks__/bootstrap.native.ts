function noop() {}
export const Collapse = noop
export const Popover = noop

const toggleBoolStr = (b: string | null) => !(b === 'true')

export class Dropdown {
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

export class Modal {
  el: HTMLElement
  constructor(el: HTMLElement) {
    this.el = el
  }

  show() {}
  hide() {}
}
export const Tab = noop
