<template>
  <div class="card mb-4 compose">
    <div class="card-body">
      <form @submit.prevent="submit()">
        <div v-if="createChannelMode" class="form-group">
          <div
            :class="{
              'd-flex justify-content-between align-items-center': calcPmLookup
            }"
          >
            <input
              v-model="channelUsersStr"
              type="text"
              class="form-control"
              placeholder="usernames (comma or space delimited)"
              @input="resetPmSearch"
            >
            <button
              v-if="calcPmLookup && !targetUser"
              :disabled="pmLookupStatus"
              type="button"
              class="ml-3 btn text-uppercase btn-primary"
              @click="findExistingPm"
            >
              <span v-show="promise">
                <font-awesome-icon class="mr-2" icon="sync" spin fixed-width />
              </span>
              <font-awesome-icon icon="search" class="mr-2" />
              {{ pmLookupStatus ? pmLookupStatus : 'Find Existing' }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <textarea
            ref="textarea"
            v-model="text"
            :disabled="promise"
            class="form-control"
            @keydown.ctrl.enter="submit()"
            @keydown.meta.enter="submit()"
          />
        </div>
        <div v-show="photos.length" class="form-group">
          <transition-group
            tag="div"
            name="photos"
            class="d-flex flex-wrap justify-content align-items-center"
          >
            <thumb
              v-for="(photo, i) in previewPhotos"
              :key="photo.data"
              :original="photo.data"
              :thumb="photo.data"
              removable
              class="mr-2"
              @remove="photos.splice(i, 1)"
            />
          </transition-group>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span data-test-id="message-counter">
            {{ remain }}
          </span>
          <div>
            <label
              v-show="!noPhoto"
              v-if="storage.available"
              :disabled="promise"
              class="btn btn-link text-dark add-photo mr-3"
            >
              <font-awesome-icon :icon="['far', 'image']" />
              <span class="d-none d-sm-inline ml-2">
                Photo
              </span>
              <input
                ref="file"
                type="file"
                multiple
                accept="image/*"
                style="display: none"
                @change="fileChange"
              >
            </label>
            <button
              :class="{
                'text-dark': !hasSpoiler,
                'btn-primary': hasSpoiler
              }"
              class="btn btn-link add-spoiler mr-3"
              type="button"
              @click="toggleSpoiler"
            >
              <font-awesome-icon :icon="['far', 'bell']" />
              <span class="d-none d-sm-inline ml-2">
                Spoiler
              </span>
            </button>
            <span :class="{ 'btn-group': canBroadcast }">
              <button
                :disabled="calcDisabled"
                type="submit"
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
                <span> Send </span>
              </button>
              <button
                v-if="canBroadcast"
                ref="dropdown"
                :disabled="calcDisabled"
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
          @update:spoiler="p => (spoiler = p)"
        />
      </form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import unicodeSubstring from 'unicode-substring'
import { Dropdown } from 'bootstrap.native'
import textCount from '~/assets/js/text-count'
import Thumb from '~/components/Thumb'
import InputSpoiler from '~/components/InputSpoiler'
import resettable from '~/assets/js/resettable'

function obj2FormData(obj) {
  return Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
}

export default {
  components: {
    Thumb,
    InputSpoiler
  },
  mixins: [textCount, resettable],
  props: {
    createChannelMode: {
      type: Boolean,
      default: false
    },
    noPhoto: {
      type: Boolean,
      default: false
    },
    targetUser: {
      type: String,
      default: ''
    },
    channel: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      promise: null,
      channelUsersStr: '',
      text: '',
      photos: [],
      previewPhotos: [],
      spoiler: null,
      pmLookupStatus: null,
      dropdown: null
    }
  },
  computed: {
    canBroadcast() {
      return this.channel && this.channel.acl.read.public
    },
    calcDisabled() {
      const requireTargetValue = this.createChannelMode && !this.channelUsersStr
      return (
        requireTargetValue ||
        this.promise ||
        !this.text ||
        this.remain < 0 ||
        (this.spoiler && !this.availableSpoiler)
      )
    },
    calcPmLookup() {
      return this.createChannelMode && this.channelUsersStr && !this.text
    },
    remain() {
      return 2048 - this.textLength
    },
    hasPhotos() {
      return this.photos.length
    },
    hasSpoiler() {
      return this.spoiler
    },
    availableSpoiler() {
      return (
        this.spoiler &&
        this.spoiler.topic &&
        this.spoiler.topic.length > 0 &&
        this.spoiler.topic.length <= 128
      )
    },
    ...mapGetters(['storage'])
  },
  watch: {
    async photos() {
      const promisePhotos = this.photos.map(file => {
        return new Promise(resolve => {
          const fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = e => {
            file.data = e.target.result
            resolve(file)
          }
        })
      })
      this.previewPhotos = await Promise.all(promisePhotos)
    },
    targetUser(user) {
      this.channelUsersStr = user
    }
  },
  mounted() {
    this.$mousetrap.bind('n', e => {
      this.$refs.textarea.focus()
      e.preventDefault()
    })
    if (!this.$refs.dropdown) return
    this.dropdown = new Dropdown(this.$refs.dropdown)
  },
  beforeDestroy() {
    this.$mousetrap.unbind('n')
  },
  methods: {
    async broadcast() {
      const option = await this.createGeneralPost()
      const raw = [
        {
          type: 'io.pnut.core.crosspost',
          value: {
            // TODO: use rel="canonical" value in the future
            canonical_url: location.href
          }
        },
        {
          type: 'io.pnut.core.channel.invite',
          value: {
            channel_id: this.channel.id
          }
        }
      ]
      option.raw.push(...raw)
      option.text = `${unicodeSubstring(this.text, 0, 255)}…`
      const res = await this.$axios.$post('/posts', option)
      this.promise = true
      await this.submit(option)
      return res
    },
    toggleSpoiler() {
      this.spoiler = this.spoiler ? null : {}
    },
    resetPmSearch() {
      this.pmLookupStatus = null
    },
    async findExistingPm() {
      this.pmLookupStatus = 'Searching'
      try {
        const destinations = this.channelUsersStr.split(/[,\s]+/g).map(name => {
          return name.startsWith('@') ? name : `@${name}`
        })
        this.promise = this.$axios.$get(
          `/users/me/channels/existing_pm?ids=${destinations.join(',')}`
        )
        const { data: channel } = await this.promise
        if (channel) {
          this.$router.push(`/messages/${channel.id}`)
          this.$emit('foundChannel')
        } else {
          this.pmLookupStatus = 'Not Found'
        }
      } catch (e) {
        this.pmLookupStatus = 'Not Found'
      }
      this.promise = null
    },
    async createGeneralPost() {
      const option = {
        text: this.text,
        raw: []
      }
      if (this.hasPhotos) {
        const raws = await this.uploadPhotos()
        option.raw.push(...raws)
      }
      if (this.spoiler) {
        option.raw.push({
          type: 'shawn.spoiler',
          value: {
            topic: this.spoiler.topic
          }
        })
      }
      return option
    },
    async submit(preparedOption = null) {
      if (this.createChannelMode) return this.createChannel()
      try {
        const option = preparedOption || (await this.createGeneralPost())
        option.text = this.text
        this.promise = this.$axios.$post(
          `/channels/${this.$route.params.channel}/messages?update_marker=1`,
          option
        )
        const { meta } = await this.promise
        if (meta.code === 201) {
          this.$emit('submit')
        }
        this.text = ''
        this.$toast.success('Posted!')
        this.photos = []
        this.spoiler = null
      } catch (e) {
        console.error(e)
        this.$toast.error(e.message)
      }
      this.promise = null
    },
    async createChannel() {
      const destinations = this.channelUsersStr.split(/[,\s]+/g).map(name => {
        return name.startsWith('@') ? name : `@${name}`
      })
      const option = {
        text: this.text,
        destinations
      }
      const { data: channel } = await this.$axios.$post(
        '/channels/pm/messages',
        option
      )
      this.channelUsersStr = ''
      this.text = ''
      this.photos = []
      this.$router.push(`/messages/${channel.channel_id}`)
      this.$emit('submit')
    },
    async uploadPhotos() {
      const photosPromise = this.photos.map(async content => {
        const data = obj2FormData({
          type: 'net.unsweets.beta',
          name: content.name,
          kind: 'image',
          content,
          is_public: false
        })
        const res = await this.$axios.$post('/files', data, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        return res
      })
      this.promise = true
      const photosJson = await Promise.all(photosPromise)
      const raws = photosJson.map(res => {
        const image = res.data
        const value = {
          '+io.pnut.core.file': {
            file_id: image.id,
            file_token: image.file_token,
            format: 'oembed'
          }
        }
        return Object.assign(
          {},
          {
            type: 'io.pnut.core.oembed'
          },
          { value }
        )
      })
      return raws
    },
    fileChange(e) {
      if (!e.target.files.length) return
      this.photos.push(...Array.prototype.slice.call(e.target.files))
      // reset file form for detecting changes(if there `sn't below code, not working when is selected same file)
      this.$refs.file.value = ''
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
