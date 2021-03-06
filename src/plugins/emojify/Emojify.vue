<template>
  <component :is="element" v-bind="$attrs">
    <template v-for="(t, i) in modifiedText">
      <span v-if="t.type === 'text'" :key="`text-${i}`" v-text="t.value" />
      <img
        v-else
        :key="`emoji-${i}`"
        :src="`https://twemoji.maxcdn.com/2/72x72/${toCodePoint(t.value)}.png`"
        :alt="t.value"
        class="emoji"
      />
    </template>
  </component>
</template>
<script lang="ts">
import Vue from 'vue'
import twemoji from 'twemoji'
import emojiRegex from 'emoji-regex/es2015'

// https://github.com/twitter/twemoji/blob/27fe654b2bed5331cf1730bb4fbba1efa40af626/2/twemoji.js#L234
const U200D = String.fromCharCode(0x200d)

interface TypedText {
  type: 'text' | 'emoji'
  value: string
}
export default Vue.extend({
  name: 'Emojify',
  props: {
    element: {
      type: [String, Object, Function],
      default: 'span',
    },
    text: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    modifiedText() {
      const text: string = this.text
      const regex = emojiRegex()
      let match
      let ep = 0
      const res: TypedText[] = []
      while ((match = regex.exec(text))) {
        const emoji = match[0]
        if (ep !== match.index)
          res.push({
            type: 'text',
            value: text.substring(ep, match.index),
          })
        res.push({
          type: 'emoji',
          value:
            // https://github.com/twitter/twemoji/blob/27fe654b2bed5331cf1730bb4fbba1efa40af626/2/twemoji.js#L321
            !emoji.includes(U200D) ? emoji.replace(/\uFE0F/g, '') : emoji,
        })
        ep = match.index + emoji.length
      }
      if (ep !== text.length)
        res.push({
          type: 'text',
          value: text.substring(ep, text.length),
        })
      return res.filter((obj) => obj.value)
    },
  },
  methods: {
    toCodePoint: twemoji.convert.toCodePoint,
  },
})
</script>
