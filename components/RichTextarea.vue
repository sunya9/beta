<template>
  <textarea
    @keydown.ctrl.enter="$emit('submit')"
    @keydown.meta.enter="$emit('submit')"
    :disabled="disabled"
    @input="updateValue($event.target.value)"
    :value="value"
    ref="textarea">
    </textarea>
</template>

<script>
import stringLength from 'string-length'
import emojione from 'emojione'

// raw -> emojify -> marked -> count

export default {
  props: {
    value: String,
    disabled: Boolean
  },
  watch: {
    compiledText(text) {
      this.$emit('update:compiledText', text)
    },
    compiledTextLength(length) {
      this.$emit('update:compiledTextCount', length)
    }
  },
  computed: {
    compiledText() {
      return emojione.shortnameToUnicode(this.value)
    },
    compiledTextLength() {
      // http://stackoverflow.com/a/32382702
      const stripMarked = this.compiledText.replace(/\[([^\]]+)\][^)]+\)/g, '$1')
      const length = stringLength(stripMarked)
      return length
    }
  },
  methods: {
    insertText(text) {
      const { textarea } = this.$refs
      if (document.selection) {
        textarea.focus()
        const sel = document.selection.createRange()
        sel.text = text
        textarea.focus()
      } else if (textarea.selectionStart || textarea.selectionStart === 0) {
        const startPos = textarea.selectionStart
        const endPos = textarea.selectionEnd
        const scrollTop = textarea.scrollTop
        const updateText = textarea.value.substring(0, startPos) +
          text +
          textarea.value.substring(endPos, textarea.value.length)
        this.updateValue(updateText)
        this.$nextTick(() => {
          textarea.focus()
          textarea.selectionStart = startPos + text.length
          textarea.selectionEnd = startPos + text.length
          textarea.scrollTop = scrollTop
        })
      } else {
        this.updateValue(this.text + text)
        textarea.focus()
      }
    },
    focus() {

    },
    setCaret(start, end) {
      if (end === undefined) {
        end = start
      }
      const input = this.$refs.textarea
      if ('selectionStart' in input) {
        input.selectionStart = start
        input.selectionEnd = end
      } else if (input.setSelectionRange) {
        input.setSelectionRange(start, end)
      } else if (input.createTextRange) {
        const range = input.createTextRange()
        range.collapse(true)
        range.moveEnd('character', end)
        range.moveStart('character', start)
        range.select()
      }
      input.focus()
    },

    updateValue(text) {
      this.$emit('input', text)
    }
  }
}
</script>
