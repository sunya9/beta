import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { User } from '~/entity/user'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import { LongPost } from '~/entity/raw/raw/long-post'
import textCount from '~/assets/ts/text-count'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'

export interface FileWrapper {
  file: File
  id: string
}

interface ComposeOptions {
  textCount: number
}

export function createCompose(composeOptions: ComposeOptions) {
  @Component
  class ComposeAbstract extends Mixins(textCount) {
    @Prop({
      type: String,
      default: '',
    })
    initialText!: string

    @Prop({
      type: Boolean,
      default: false,
    })
    focus!: boolean

    fileWrappers: FileWrapper[] = []
    promise: boolean = false
    text: string = this.initialText
    replyStartPos = 0
    showEmojiPicker = false

    spoiler: Spoiler.Value | null = null
    longpost: LongPost.Value | null = null
    nsfw = false

    get postCounter(): number {
      return composeOptions.textCount - this.textLength
    }

    get textOverflow(): boolean {
      return this.postCounter < 0
    }

    get hasNoText(): boolean {
      return !this.textLength
    }

    get files(): File[] {
      return this.fileWrappers.map((fileWrapper) => fileWrapper.file)
    }

    initialize() {
      this.fileWrappers = []
      this.text = ''
      this.poll = null
      this.spoiler = null
      this.longpost = null
      this.nsfw = false
    }

    $refs!: {
      picker: Vue
      textarea: HTMLTextAreaElement
    }

    get user(): User | null {
      return this.$accessor.user
    }

    poll: CreatePollRequest | null = null

    get disabled(): boolean {
      const sending = !!this.promise
      return !!(
        this.textOverflow ||
        this.hasNoText ||
        sending ||
        (this.poll && !this.availablePoll) ||
        (this.spoiler && !this.availableSpoiler) ||
        (this.longpost && !this.availableLongpost)
      )
    }

    get availablePoll(): boolean {
      return (
        !!this.poll &&
        this.poll.options.filter((option) => option?.text).length >= 2
      )
    }

    get availableSpoiler(): boolean {
      return (
        !!this.spoiler &&
        this.spoiler.topic.length > 0 &&
        this.spoiler.topic.length <= 128
      )
    }

    get availableLongpost(): boolean {
      if (!this.longpost) return false
      const length = this.longpost.body.length
      if (!length) return false
      return (
        length > 0 &&
        length <= 6144 &&
        (!this.longpost.title || this.longpost.title.length < 128)
      )
    }

    mounted() {
      this.setFocus()
    }

    created() {
      this.text = this.initialText
    }

    setFocus(force = false) {
      if (this.focus === false && !force) return
      // occur error if it not displayed like logged out
      // TODO

      const textarea = this.$refs.textarea as any
      // TODO
      // if (this.text.length === undefined) {
      //   this.text.length = this.replyStartPos
      // }
      if ('selectionStart' in textarea) {
        textarea.selectionStart = this.replyStartPos
        textarea.selectionEnd = this.text.length
      } else if (textarea.setSelectionRange) {
        textarea.setSelectionRange(this.replyStartPos, this.text.length)
      } else if (textarea.createTextRange) {
        const range = textarea.createTextRange()
        range.collapse(true)
        range.moveEnd('character', this.text.length)
        range.moveStart('character', this.replyStartPos)
        range.select()
      }
      textarea.focus()
    }

    insertText(text: string) {
      const textarea = this.$refs.textarea
      const selection = (document as any).selection
      if (selection) {
        textarea.focus()
        const sel = (selection as any).createRange()
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
        this.text = updateText

        this.$nextTick(() => {
          textarea.focus()
          textarea.selectionStart = startPos + text.length
          textarea.selectionEnd = startPos + text.length
          textarea.scrollTop = scrollTop
        })
      } else {
        this.text = text
        textarea.focus()
      }
    }

    // TODO
    addEmoji(emoji: string) {
      this.insertText(emoji)
    }
  }
  return ComposeAbstract
}
