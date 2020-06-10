import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { User } from '~/models/user'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { LongPost } from '~/models/raw/raw/long-post'
import textCount from '~/assets/ts/text-count'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'
import { Token } from '~/models/token'

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
    promise: Promise<any> | null = null
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
      file: HTMLInputElement
    }

    fileChange(e: Event) {
      const { target } = e
      if (!(target instanceof HTMLInputElement) || !target.files?.length) return
      const newFileWrappers: FileWrapper[] = Array.from(
        target.files
      ).map((file, i) => ({ file, id: `${new Date().getTime()}-${i}` }))
      this.fileWrappers = [...this.fileWrappers, ...newFileWrappers]
      // reset file form for detecting changes(if there `sn't below code, not working when is selected same file)
      this.$refs.file.value = ''
    }

    get user(): User | null {
      return this.$accessor.user
    }

    get hasPoll(): boolean {
      return !!this.poll
    }

    get hasSpoiler(): boolean {
      return !!this.spoiler
    }

    get hasLongpost(): boolean {
      return !!this.longpost
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
        this.poll.options &&
        this.poll.options.filter((option) => option.text).length >= 2
      )
    }

    get availableSpoiler(): boolean {
      return (
        !!this.spoiler &&
        !!this.spoiler.topic &&
        this.spoiler.topic.length > 0 &&
        this.spoiler.topic.length <= 128
      )
    }

    get availableLongpost(): boolean {
      return (
        !!this.longpost &&
        !!this.longpost.body &&
        this.longpost.body.length > 0 &&
        this.longpost.body.length <= 6144 &&
        (!this.longpost.title || this.longpost.title.length < 128)
      )
    }

    mounted() {
      if (this.focus) {
        this.setFocus()
      }
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

    getSheet() {
      return require('emoji-datasource-twitter/img/twitter/sheets-128/64.png')
    }

    insertText(text: string) {
      const textarea = this.$refs.textarea
      const getSelection = document.getSelection()
      if (getSelection) {
        textarea.focus()

        const sel = (getSelection as any).createRange()
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
    addEmoji(emoji: any) {
      this.insertText(emoji.native)
      this.closeEmojiPalette()
    }

    async toggleEmojiPalette() {
      this.showEmojiPicker = !this.showEmojiPicker
      if (!this.showEmojiPicker) return
      await this.$nextTick()
      const input = this.$refs.picker.$el.querySelector('input')
      if (!input) return
      input.focus()
    }

    closeEmojiPalette() {
      this.showEmojiPicker = false
    }

    get storage(): Token.Storage {
      return this.$accessor.storage
    }
  }
  return ComposeAbstract
}
