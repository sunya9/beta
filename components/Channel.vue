<template>
  <nuxt-link
    :to="`/messages/${channel.id}`"
  >
    <div class="media">
      <avatar :avatar="channel.owner.content.avatar_image"
        :width="32" :height="32"
        class="mr-2"
      />
      <div class="media-body" style="overflow: hidden">
        <h5>
          {{channel.owner.name}}
          <small class="text-muted">
            @{{channel.owner.username}}
          </small>
          <i
            v-show="channel.you_muted"
            class="fa fa-bell-slash-o"></i>
        </h5>
        <p v-if="channel.recent_message"
          class="mb-0 text-truncate"
          >
          @{{channel.recent_message.user.username}}:
          <span v-if="!channel.recent_message.is_deleted">
            {{channel.recent_message.content.text}}
          </span>
          <span v-else class="text-muted">[Post deleted]</span>
        </p>
      </div>
      <span class="align-self-center">
        <i class="fa fa-chevron-right"></i>
      </span>
    </div>
  </nuxt-link>
</template>

<script>
import Avatar from '~/components/Avatar'

export default {
  props: {
    channel: Object
  },
  components: {
    Avatar
  }
}
</script>
