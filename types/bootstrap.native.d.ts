declare module 'bootstrap.native' {
  export class Collapse {
    constructor(el: Element)
    hide(): void
  }

  export class Modal {
    constructor(el: Element)
    show(): void
    hide(): void
  }

  export class Dropdown {
    constructor(el: Element)
    toggle(): void
  }

  export class Popover {
    constructor(el: Element)
  }
  export class Tab {
    constructor(el: Element)
    show(): void
  }
}
