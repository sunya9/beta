<template>
  <div class="card mb-4 compose">
    <div class="card-body">
      <form @submit.prevent="submit()">
        <div v-if="createChannelMode" class="form-group">
          <div
            :class="{
              'd-flex justify-content-between align-items-center': calcPmLookup,
            }"
          >
            <input
              v-model="channelUsersStr"
              type="text"
              class="form-control"
              placeholder="usernames (comma or space delimited)"
            />
          </div>
        </div>
        <div class="form-group position-relative">
          <textarea
            ref="textarea"
            v-model="text"
            :disabled="promise"
            class="form-control"
            data-test-id="textarea"
            @keydown.ctrl.enter="submit()"
            @keydown.meta.enter="submit()"
          />
          <emoji-picker @select="addEmoji" />
        </div>
        <file-preview-list
          :file-wrappers="fileWrappers"
          @remove="fileWrappers.splice($event, 1)"
        />
        <div class="d-flex justify-content-between align-items-center">
          <span data-test-id="message-counter">
            {{ postCounter }}
          </span>
          <div>
            <add-file v-model="fileWrappers" :disabled="promise" class="mr-2" />
            <toggle-poll v-model="poll" :disabled="promise" class="mr-2" />
            <toggle-spoiler
              v-model="spoiler"
              :disabled="promise"
              class="mr-2"
            />
            <toggle-longpost
              v-model="longpost"
              :disabled="promise"
              class="mr-2"
            />
            <toggle-nsfw v-model="nsfw" :disabled="promise" class="mr-2" />
            <span :class="{ 'btn-group': canBroadcast }">
              <button
                :disabled="calcDisabled"
                type="submit"
                data-test-id="submitButton"
                class="ml-1 btn text-uppercase btn-primary"
              >
                <span v-show="promise && !calcPmLookup">
                  <font-awesome-icon
                    icon="sync"
                    spin
                    fixed-width
                    class="mr-2"
                  />
                </span>
                <span>Send</span>
              </button>
              <button
                v-if="canBroadcast"
                ref="dropdown"
                :disabled="calcDisabled"
                data-test-id="broadcastButton"
                type="button"
                class="btn btn-danger dropdown-toggle dropdown-toggle-split"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="sr-only">
                  Toggle Dropdown
                </span>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a
                  data-test-id="broadcast"
                  class="dropdown-item"
                  href="#"
                  @click.prevent="broadcast"
                >
                  Broadcast
                </a>
              </div>
            </span>
          </div>
        </div>
        <input-spoiler
          v-if="spoiler"
          class="mt-3"
          @update:spoiler="(p) => (spoiler = p)"
        />
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Dropdown } from 'bootstrap.native'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { createCompose } from './ComposeAbstract'
import bus from '~/assets/ts/bus'
import Thumb from '~/components/Thumb.vue'
import InputSpoiler from '~/components/InputSpoiler.vue'
import { Channel } from '~/models/channel'
import { Token } from '~/models/token'
import AddFile from '~/components/atoms/AddFile.vue'
import ToggleNsfw from '~/components/atoms/ToggleNsfw.vue'
import ToggleLongpost from '~/components/atoms/ToggleLongpost.vue'
import ToggleSpoiler from '~/components/atoms/ToggleSpoiler.vue'
import TogglePoll from '~/components/atoms/TogglePoll.vue'
import FilePreviewList from '~/components/organisms/FilePreviewList.vue'
import EmojiPicker from '~/components/molecules/EmojiPicker.vue'

@Component({
  components: {
    Thumb,
    InputSpoiler,
    AddFile,
    ToggleNsfw,
    ToggleLongpost,
    ToggleSpoiler,
    TogglePoll,
    FilePreviewList,
    EmojiPicker,
  },
})
export default class MessageCompose extends createCompose({ textCount: 2048 }) {
  @Prop({
    type: Boolean,
    default: false,
  })
  createChannelMode!: boolean

  @Prop({
    type: String,
    default: '',
  })
  targetUser!: string

  @Prop({
    type: Object,
    default: null,
  })
  channel!: Channel

  $refs!: {
    dropdown: HTMLButtonElement
  } & InstanceType<ReturnType<typeof createCompose>>['$refs']

  channelUsersStr = ''
  text = ''
  dropdown: Dropdown | null = null

  get canBroadcast(): boolean {
    return this.channel && this.channel.acl.read.public
  }

  get calcDisabled(): boolean {
    const requireTargetValue = this.createChannelMode && !this.channelUsersStr
    return (
      requireTargetValue ||
      !!this.promise ||
      !this.text ||
      this.postCounter < 0 ||
      (!!this.spoiler && !this.availableSpoiler)
    )
  }

  get calcPmLookup(): boolean {
    return this.createChannelMode && !!this.channelUsersStr && !this.text
  }

  get availableSpoiler(): boolean {
    return (
      !!this.spoiler &&
      !!this.spoiler.topic &&
      this.spoiler.topic.length > 0 &&
      this.spoiler.topic.length <= 128
    )
  }

  get storage(): Token.Storage {
    return this.$accessor.storage
  }

  @Watch('targetUser')
  onChangeTargetUser(user: MessageCompose['targetUser']) {
    this.channelUsersStr = user
  }

  mounted() {
    this.$mousetrap.bind('n', (e) => {
      this.$refs.textarea.focus()
      e.preventDefault()
    })
    if (!this.$refs.dropdown) return
    this.dropdown = new Dropdown(this.$refs.dropdown)
  }

  beforeDestroy() {
    this.$mousetrap.unbind('n')
  }

  async broadcast() {
    await this.submit(true)
  }

  async submit(broadcast?: boolean) {
    if (this.promise) return
    const channelId = this.$route.params.channel
    this.promise = true
    try {
      if (this.createChannelMode) this.createChannel()
      else {
        const promise = await this.$interactors.createMessage.run({
          channelId,
          text: this.text,
          isNsfw: this.nsfw,
          files: this.files,
          spoiler: this.spoiler,
          longpost: this.longpost,
          pollRequest: this.poll,
          broadcast,
          // replyTo: this.reply,
        })
        const {
          res: { meta },
        } = await promise
        if (meta.code === 201) {
          this.$emit('submit')
        }
      }
      bus.$emit('post')
      this.text = ''
      this.$toast.success('Posted!')
      this.spoiler = null
    } catch (e) {
      console.error(e)
      this.$toast.error(e.message)
    }
    this.promise = false
  }

  async createChannel() {
    try {
      const {
        res: { data: message },
      } = await this.$interactors.createPrivateChannel.run({
        destinations: this.channelUsersStr,
        text: this.text,
        isNsfw: this.nsfw,
        files: this.files,
        spoiler: this.spoiler,
        longpost: this.longpost,
        pollRequest: this.poll,
      })
      this.initialize()
      this.$router.push(`/messages/${message.channel_id}`)
      this.$emit('submit')
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.compose {
  @include no-gutter-xs;
}
textarea {
  min-height: 5rem;
}
.add-photo {
  cursor: pointer;
  margin-bottom: 0;
}
</style>
