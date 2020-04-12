// TODO: Fix dirty code
const isBrowser = process.browser || process.env.NODE_ENV === 'test'
export const Picker = isBrowser ? require('emoji-mart-vue').Picker : null
