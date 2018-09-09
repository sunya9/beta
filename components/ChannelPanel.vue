<template>
  <div>
    <h1>
      <!-- disabled v-emojify temporarily -->
      <span>{{ $metaInfo.title }}</span>
      <button
        v-if="chat && isModerator"
        class="btn btn-link mr-2"
        type="button"
        @click="channelEditModal">
        <font-awesome-icon
          :icon="['far', 'edit']"
          class="mr-2" />
        <span class="d-none d-sm-inline">Edit</span>
      </button>
    </h1>
    <div class="row">
      <div class="col-sm col-md-12">
        <p
          v-if="chat"
          class="text-muted">
          {{ chat.description }}
        </p>
        <div
          v-if="user"
          class="form-group">
          <custom-checkbox
            v-model="channel.you_subscribed"
            :resource="`/channels/${channel.id}/subscribe`"
            @change="cancelMute">
            Subscribed
          </custom-checkbox>
          <custom-checkbox
            v-model="channel.you_muted"
            :resource="`/channels/${channel.id}/mute`"
            @change="cancelSubscribe">
            Muted
          </custom-checkbox>
          <custom-checkbox
            :checked="!channel.has_unread"
            :disabled="!channel.has_unread"
            @change="markAsRead">
            Mark as read
          </custom-checkbox>
        </div>
        <template v-if="chat && chat.categories">
          Categories
          <ul>
            <template v-for="i in chat.categories">
              <li :key="i">{{ i.charAt(0).toUpperCase() + i.slice(1) }}</li>
            </template>
          </ul>
        </template>
      </div>
      <div class="col-sm col-md-12">
        <h2 class="h3">
          <span v-if="!chat || !channel.acl.read.public">Members</span>
          <span v-else-if="chat">
            <font-awesome-icon
              icon="globe"
              class="mr-2"
            />
            <span>Public</span>
          </span>
          <button
            v-if="chat && isModerator"
            class="btn btn-link mr-2"
            type="button"
            @click.stop.prevent="memberEditModal">
            <font-awesome-icon :icon="['far', 'edit']"/>
            <span class="d-none d-sm-inline ml-2">Edit</span>
          </button>
        </h2>
        <span
          v-if="chat"
          class="mb-2">Owner</span>
        <ul
          :class="{'pm-ul': !chat}"
          class="list-unstyled">
          <li
            :key="channel.owner.id"
            class="mb-2">
            <nuxt-link
              :to="`/@${channel.owner.username}`"
              class="d-flex flex-row align-items-center flex-nowrap">
              <avatar
                :avatar="channel.owner.content.avatar_image.link"
                size="24"
                max-size="24"
                class="mr-2" />
              <div class="d-flex align-items-baseline flex-wrap">
                @{{ channel.owner.username }}
                <small class="ml-1 text-muted">
                  {{ channel.owner.name }}
                </small>
              </div>
            </nuxt-link>
          </li>
        </ul>
        <template v-if="chat && channel.acl.full.user_ids.length">
          <span class="mb-2">Moderators</span>
          <ul class="list-unstyled">
            <li
              v-for="user in channel.acl.full.user_ids"
              :key="user.id"
              class="mb-2">
              <nuxt-link
                :to="`/@${user.username}`"
                class="d-flex flex-row align-items-center flex-nowrap">
                <avatar
                  :avatar="user.avatar_image"
                  size="24"
                  max-size="24"
                  class="mr-2" />
                <div class="d-flex align-items-baseline flex-wrap">
                  @{{ user.username }}
                  <small class="ml-1 text-muted">
                    {{ user.name }}
                  </small>
                </div>
              </nuxt-link>
            </li>
          </ul>
        </template>
        <template v-if="channel.acl.write.user_ids.length && !channel.acl.write.any_user">
          <span
            v-if="chat"
            class="mb-2">Writers</span>
          <ul class="list-unstyled">
            <li
              v-for="user in channel.acl.write.user_ids"
              :key="user.id"
              class="mb-2">
              <nuxt-link
                :to="`/@${user.username}`"
                class="d-flex flex-row align-items-center flex-nowrap">
                <avatar
                  :avatar="user.avatar_image"
                  size="24"
                  max-size="24"
                  class="mr-2" />
                <div class="d-flex align-items-baseline flex-wrap">
                  @{{ user.username }}
                  <small class="ml-1 text-muted">
                    {{ user.name }}
                  </small>
                </div>
              </nuxt-link>
            </li>
          </ul>
        </template>
        <template v-if="chat && channel.acl.read.user_ids.length && !channel.acl.read.any_user">
          <span class="mb-2">Readers</span>
          <ul class="list-unstyled">
            <li
              v-for="user in channel.acl.read.user_ids"
              :key="user.id"
              class="mb-2">
              <nuxt-link
                :to="`/@${user.username}`"
                class="d-flex flex-row align-items-center flex-nowrap">
                <avatar
                  :avatar="user.avatar_image"
                  size="24"
                  max-size="24"
                  class="mr-2" />
                <div class="d-flex align-items-baseline flex-wrap">
                  @{{ user.username }}
                  <small class="ml-1 text-muted">
                    {{ user.name }}
                  </small>
                </div>
              </nuxt-link>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import CustomCheckbox from '~/components/CustomCheckbox'
import Avatar from '~/components/Avatar'
import { mapGetters } from 'vuex'
import markAsRead from '~/assets/js/mark-as-read'
import { findChatRaw } from '~/assets/js/util'

export default {
  components: {
    CustomCheckbox,
    Avatar
  },
  mixins: [markAsRead],
  props: {
    initialChannel: {
      type: Object,
      required: true
    },
    isModerator: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      channel: this.initialChannel
    }
  },
  computed: {
    chat() {
      return findChatRaw(this.channel, true)
    },
    ...mapGetters(['user'])
  },
  watch: {
    channel: {
      handler(channel) {
        this.$emit('update:initialChannel', channel)
      },
      immediate: true
    }
  },
  methods: {
    cancelSubscribe(bool) {
      if (bool) this.channel.you_subscribed = false
    },
    cancelMute(bool) {
      if (bool) this.channel.you_muted = false
    }
  },
  head() {
    return {
      title: `Room ${this.channel.id}`
    }
  }
}
</script>
<style scoped lang="scss">
.pm-ul {
  margin-bottom: 0;
}
</style>
