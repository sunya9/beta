import { createAppMenus } from './App'
import { createSettingsMenu } from './Settings'
import { createFileMenu } from './Files'
import { createAboutMenu } from './About'
import { createSearchMenu } from './Search'

export interface MenuItem {
  type?: string
  label: string
  hidden?: boolean
  icon?: string | string[]
  url?: string
  click?: () => void
  normal?: boolean
  active?: boolean | (() => boolean)
}

function getRouteName(self: Vue): string {
  if (!self.$route.name) return ''
  const matcher = self.$route.name.match(/^[\w@]*/)
  return matcher ? matcher[0] : ''
}

export function getMenus(self: Vue): MenuItem[] {
  const menus: { [key: string]: () => MenuItem[] } = {
    settings: () => createSettingsMenu(),
    about: () => createAboutMenu(self),
    files: () => createFileMenu(),
    search: () => createSearchMenu(self),
    messages: () => [],
  }
  const routeName = getRouteName(self)
  return routeName in menus
    ? menus[routeName]()
    : createAppMenus({ user: self.$store.getters.user, self })
}

export function getMenusWithMeta(self: Vue) {
  const menus = getMenus(self)
  const isDefault = ![
    'settings',
    'about',
    'files',
    'search',
    'messages',
  ].includes(getRouteName(self))
  return {
    menus,
    isDefault,
  }
}
