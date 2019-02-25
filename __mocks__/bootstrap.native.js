function noop() {}
export const Collapse = noop
export const Modal = noop
export const Popover = noop

const toggleBoolStr = b => !(b === 'true')

function toggle() {
  const b = this.el.getAttribute('aria-expanded')
  this.el.setAttribute('aria-expanded', `${toggleBoolStr(b)}`)
}

export const Dropdown = function(dropdownEl) {
  this.el = dropdownEl
  if (!this.el) return
  this.btn = this.el.querySelector('[data-toggle="dropdown"]')
  if (!this.btn) return
  this.btn.addEventListener('click', toggle.bind(this))
}

Dropdown.prototype.toggle = function() {
  toggle.bind(this)
}

export const Tab = noop
