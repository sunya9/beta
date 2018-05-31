<template>
	<nuxt-link :to="`/messages/${channel.id}`">
		<div class="media">
			<avatar :avatar="{ link: opponent.avatar_image }" size="32" class="mr-2" />
			<div class="media-body" style="overflow: hidden">
				<h5>
					<span v-if="opponent.name">
						{{opponent.name}}
						<small class="text-muted">
							@{{opponent.username}}
						</small>
					</span>
					<span v-else>
						@{{opponent.username}}
					</span>
					<i v-show="channel.you_muted" class="fa fa-bell-slash-o"></i>
				</h5>
				<p v-if="channel.recent_message" class="mb-0 text-truncate">
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
import { mapState } from 'vuex'

export default {
  props: {
    channel: Object
  },
  computed: {
    ...mapState(['user']),
    opponent() {
      if (this.channel.owner.id === this.user.id) {
        return this.channel.acl.write.user_ids[0]
      } else {
        const {
          username,
          name,
          id,
          content: {
            avatar_image: { link: avatar_image }
          }
        } = this.channel.owner

        const res = {
          username,
          name,
          id,
          avatar_image
        }
        return res
      }
    }
  },
  components: {
    Avatar
  }
}
</script>
