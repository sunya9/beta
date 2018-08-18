<template>
	<div class="card mb-4 no-gutter-xs">
		<div class="card-body">
			<form @submit.prevent="submit">
				<div class="form-group" v-if="createChannelMode">
          <div :class="{'d-flex justify-content-between align-items-center': calcPmLookup}">
  					<input type="text" v-model="channelUsersStr" class="form-control" placeholder="usernames (comma or space delimited)" @input="resetPmSearch" />
            <button v-if="calcPmLookup" type="button" class="ml-3 btn text-uppercase btn-primary" :disabled="pmLookupStatus" @click="findExistingPm">
              <span v-show="promise">
                <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
              </span>
              <i class="fa fa-search"></i>
              {{pmLookupStatus ? pmLookupStatus : 'Find Existing'}}
            </button>
          </div>
				</div>
				<div class="form-group">
					<textarea class="form-control" v-model="text" @keydown.ctrl.enter="submit" @keydown.meta.enter="submit" :disabled="promise">
					</textarea>
				</div>
        <div class="form-group" v-show="photos.length">
          <transition-group tag="div" name="photos" class="d-flex flex-wrap justify-content align-items-center">
            <thumb :key="photo.data" v-for="(photo, i) in previewPhotos" :original="photo.data" :thumb="photo.data" removable class="mr-2" @remove="photos.splice(i, 1)" />
          </transition-group>
        </div>
				<div class="d-flex justify-content-between align-items-center">
					<span data-test-id="message-counter">{{remain}}</span>
          <div>
            <label v-show="!noPhoto" v-if="storage.available" class="btn btn-link text-dark add-photo mr-3" :disabled="promise">
              <i class="fa fa-picture-o"></i>
              <span class="d-none d-sm-inline ml-2">Photo</span>
              <input type="file" multiple accept="image/*" @change="fileChange" style="display: none" ref="file">
            </label>
            <button class="btn btn-link add-spoiler mr-3" type="button" @click="toggleSpoiler" :class="{
                  'text-dark': !hasSpoiler,
                  'btn-primary': hasSpoiler
                }">
              <i class="fa fa-bell-o"></i>
              <span class="d-none d-sm-inline ml-2">Spoiler</span>
            </button>
  					<button type="submit" class="ml-1 btn text-uppercase btn-primary" :disabled="calcDisabled">
  						<span v-show="promise && !calcPmLookup">
  							<i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
  						</span>
  						Send
  					</button>
          </div>
				</div>
        <input-spoiler @update:spoiler="p => spoiler = p" v-if="spoiler" class="mt-3" />
			</form>
		</div>
	</div>
</template>
<script>
import textCount from '~/assets/js/text-count'
import { mapGetters } from 'vuex'
import Thumb from '~/components/Thumb'
import InputSpoiler from '~/components/InputSpoiler'

export default {
  mixins: [textCount],
  props: {
    createChannelMode: {
      type: Boolean,
      default: false
    },
    noPhoto: Boolean
  },
  data() {
    return {
      promise: null,
      channelUsersStr: '',
      text: '',
      photos: [],
      previewPhotos: [],
      spoiler: null,
      pmLookupStatus: null
    }
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
    }
  },
  computed: {
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
  methods: {
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
          '/users/me/channels/existing_pm?ids=' + destinations.join(',')
        )
        const { data: channel } = await this.promise
        if (channel) {
          this.$router.push(`/messages/${channel.id}`)
        } else {
          this.pmLookupStatus = 'Not Found'
        }
      } catch (e) {
        this.pmLookupStatus = 'Not Found'
      }
      this.promise = null
    },
    async submit() {
      if (this.createChannelMode) return this.createChannel()
      const option = {
        text: this.text,
        raw: []
      }
      try {
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
  },
  components: {
    Thumb,
    InputSpoiler
  }
}

function obj2FormData(obj) {
  return Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
}
</script>

<style scoped>
textarea {
  min-height: 5rem;
}
.add-photo {
  cursor: pointer;
  margin-bottom: 0;
}
</style>
