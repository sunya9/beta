<template>
  <div class="card mb-4 compose">
    <div class="card-body">
      <form @submit.prevent="submit()">
        <div v-if="createChannelMode" class="form-group">
          <suggest-users @update:users="(newUsers) => (users = newUsers)" />
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

            <b-dropdown
              :split="canBroadcast"
              :no-caret="!canBroadcast"
              :disabled="calcDisabled"
              variant="primary"
              class="ml-1 text-uppercase"
              split-button-type="submit"
            >
              <template v-slot:button-content>
                <span class="text-uppercase">
                  <font-awesome-icon
                    v-show="promise"
                    icon="sync"
                    spin
                    fixed-width
                    class="mr-2"
                  />
                  Send
                </span>
              </template>
              <b-dropdown-item-button
                data-test-id="broadcast"
                @click.prevent="broadcast"
              >
                Broadcast
              </b-dropdown-item-button>
            </b-dropdown>
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
import { Component, Prop, Watch } from 'vue-property-decorator'
import { User } from '../../models/user'
import { createCompose } from './ComposeAbstract'
import bus from '~/assets/ts/bus'
import Thumb from '~/components/Thumb.vue'
import InputSpoiler from '~/components/InputSpoiler.vue'
import { Channel } from '~/models/channel'
import AddFile from '~/components/atoms/AddFile.vue'
import ToggleNsfw from '~/components/atoms/ToggleNsfw.vue'
import ToggleLongpost from '~/components/atoms/ToggleLongpost.vue'
import ToggleSpoiler from '~/components/atoms/ToggleSpoiler.vue'
import TogglePoll from '~/components/atoms/TogglePoll.vue'
import FilePreviewList from '~/components/organisms/FilePreviewList.vue'
import EmojiPicker from '~/components/molecules/EmojiPicker.vue'
import SuggestUsers from '~/components/organisms/SuggestUsers.vue'

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
    SuggestUsers,
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

  users: User[] = []
  text = ''

  get canBroadcast(): boolean {
    return this.channel && this.channel.acl.read.public
  }

  get calcDisabled(): boolean {
    const requireTargetValue = this.createChannelMode && !this.users.length
    return (
      requireTargetValue ||
      !!this.promise ||
      !this.text ||
      this.postCounter < 0 ||
      (!!this.spoiler && !this.availableSpoiler)
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

  @Watch('targetUser')
  onChangeTargetUser(user: User) {
    this.users = [user]
  }

  mounted() {
    this.$mousetrap.bind('n', (e) => {
      this.$refs.textarea.focus()
      e.preventDefault()
    })
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
        users: this.users,
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
