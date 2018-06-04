<template>
	<textarea @keyup.ctrl.enter="$emit('submit')" @keyup.meta.enter="$emit('submit')" :disabled="disabled" v-model="value" @keyup="debounceKeyup" @change="keyup" ref="textarea">
	</textarea>
</template>

<script>
import stringLength from 'string-length'
import _ from 'lodash'
// raw -> marked -> count

export default {
  props: {
    initialValue: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },
  watch: {
    initialValue(value) {
      this.value = value
    }
  },
  data() {
    return {
      value: this.initialValue,
      debounceKeyup: null
    }
  },
  computed: {
    length() {
      // http://stackoverflow.com/a/32382702
      const stripMarked = this.value.replace(/\[([^\]]+)\][^)]+\)/g, '$1')
      const length = stringLength(stripMarked)
      return length
    }
  },
  beforeMount() {
    this.debounceKeyup = _.debounce(this.keyup, 200)
  },
  methods: {
    keyup() {
      this.$emit('update:prop', {
        value: this.value,
        length: this.length
      })
    },
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
        const updateText =
          textarea.value.substring(0, startPos) +
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
    }
  }
}
</script>
