<template>
	<div>
		<h1 class="h3 mb-4">
			<nuxt-link to="/messages">
				<i class="fa fa-chevron-left"></i>
				{{$metaInfo.title}}
			</nuxt-link>
      <small v-if="!isPM" class="text-muted">
        {{chat.description}}
      </small>
		</h1>
		<div class="row">
			<div class="col-md-4 order-md-2">
				<div class="row flex-">
					<div class="col-sm col-md-12">
						<h2 class="h3">Room info <button v-if="!isPM && isModerator" class="btn btn-link mr-2 text-dark" type="button" @click.stop.prevent="channelEditModal">
                <i class="fa fa-pencil-square-o"></i>
                <span class="d-none d-sm-inline ml-2">Edit</span>
              </button></h2>
						<div class="form-group" v-if="user">
							<custom-checkbox v-model="channel.you_subscribed" @change="cancelMute" :resource="`/channels/${channel.id}/subscribe`">
								Subscribed
							</custom-checkbox>
							<custom-checkbox v-model="channel.you_muted" @change="cancelSubscribe" :resource="`/channels/${channel.id}/mute`">
								Muted
							</custom-checkbox>
              <!--<custom-checkbox v-model="channel.has_unread" @change="markAsRead" :checked="!channel.has_unread" :disabled="!channel.has_unread">
                {{channel.has_unread ? 'Mark as read' : 'All read'}}
              </custom-checkbox>-->
              <button class="btn btn-link mr-2" :disabled="!channel.has_unread" type="button" @click.stop.prevent="markAsRead">
                <i class="fa" :class="{'fa-envelope-open': channel.has_unread, 'fa-envelope-open-o': !channel.has_unread}" aria-hidden="true"></i>
                <span class="d-none d-sm-inline ml-2">{{channel.has_unread ? 'Mark as read' : 'All read'}}</span>
              </button>
						</div>
            <template v-if="!isPM && chat.categories">
              Categories
              <ul>
                <template v-for="i in chat.categories">
                  <li :key="i">{{i.charAt(0).toUpperCase() + i.slice(1)}}</li>
                </template>
              </ul>
            </template>
            <h2 class="h3">
              <span v-if="isPM || !channel.acl.read.public">Members</span>
              <span v-else-if="!isPM"><i class="fa fa-globe" aria-hidden="true"></i> Public</span>
              <button v-if="!isPM && isModerator" class="btn btn-link mr-2 text-dark" type="button" @click.stop.prevent="memberEditModal">
                <i class="fa fa-pencil-square-o"></i>
                <span class="d-none d-sm-inline ml-2">Edit</span>
              </button>
            </h2>
					</div>
					<div class="col-sm col-md-12">
            <template v-if="!isPM">
              <span class="mb-2">Owner</span>
  						<ul class="list-unstyled" :class="{'pm-ul': isPM}">
                <li :key="channel.owner.id" class="mb-2">
                  <nuxt-link class="d-flex flex-row align-items-center flex-nowrap" :to="`/@${channel.owner.username}`">
                    <avatar :avatar="channel.owner.content.avatar_image.link" size="24" max-size="24" class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{channel.owner.username}}
                      <small class="ml-1 text-muted">
                        {{channel.owner.name}}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </template>
            <template v-if="!isPM && channel.acl.full.user_ids.length">
              <span class="mb-2">Moderators</span>
              <ul class="list-unstyled">
                <li v-for="user in channel.acl.full.user_ids" :key="user.id" class="mb-2">
                  <nuxt-link class="d-flex flex-row align-items-center flex-nowrap" :to="`/@${user.username}`">
                    <avatar :avatar="user.avatar_image" size="24" max-size="24" class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{user.username}}
                      <small class="ml-1 text-muted">
                        {{user.name}}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </template>
            <template v-if="channel.acl.write.user_ids.length && !channel.acl.write.any_user">
              <span v-if="!isPM" class="mb-2">Writers</span>
              <ul class="list-unstyled">
  							<li v-for="user in channel.acl.write.user_ids" :key="user.id" class="mb-2">
  								<nuxt-link class="d-flex flex-row align-items-center flex-nowrap" :to="`/@${user.username}`">
  									<avatar :avatar="user.avatar_image" size="24" max-size="24" class="mr-2" />
  									<div class="d-flex align-items-baseline flex-wrap">
  										@{{user.username}}
  										<small class="ml-1 text-muted">
  											{{user.name}}
  										</small>
  									</div>
  								</nuxt-link>
  							</li>
              </ul>
            </template>
            <template v-if="!isPM && channel.acl.read.user_ids.length && !channel.acl.read.any_user">
              <span class="mb-2">Readers</span>
              <ul class="list-unstyled">
                <li v-for="user in channel.acl.read.user_ids" :key="user.id" class="mb-2">
                  <nuxt-link class="d-flex flex-row align-items-center flex-nowrap" :to="`/@${user.username}`">
                    <avatar :avatar="user.avatar_image" size="24" max-size="24" class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{user.username}}
                      <small class="ml-1 text-muted">
                        {{user.name}}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
  						</ul>
            </template>
					</div>
				</div>
			</div>
			<div class="col-md-8 order-md-1">
				<message-compose v-if="canPost" v-model="message" @submit="() => $refs.list.refresh()" />
				<div class="card no-gutter-xs">
					<div class="card-body">
						<List :data="data" type="Message" ref="list" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import List from '~/components/List'
import MessageCompose from '~/components/MessageCompose'
import CustomCheckbox from '~/components/CustomCheckbox'
import Avatar from '~/components/Avatar'
import { mapState } from 'vuex'
import bus from '~/assets/js/bus'

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  data() {
    return {
      message: '',
      promise: null
    }
  },
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const messagesPromise = $resource()
    const channelPromise = $axios.$get(`/channels/${params.channel}`, {
      params: {
        include_limited_users: 1,
        include_channel_raw: 1
      }
    })
    try {
      const [data, { data: channel }] = await Promise.all([
        messagesPromise,
        channelPromise
      ])
      return {
        data,
        channel
      }
    } catch (e) {
      const { code, error_message } = e.response.data.meta
      error({
        statusCode: code,
        message: error_message
      })
    }
  },
  methods: {
    cancelSubscribe(bool) {
      if (bool) this.channel.you_subscribed = false
    },
    cancelMute(bool) {
      if (bool) this.channel.you_muted = false
    },
    memberEditModal() {
      bus.$emit('showChannelMemberEditModal', this)
    },
    editMembers() {},
    channelEditModal() {
      bus.$emit('showChannelEditModal', this)
    },
    async update(updatedChannel) {
      try {
        this.promise = this.$axios.$put(
          '/channels/' +
            this.channel.id +
            '?include_channel_raw=1&include_limited_users=1',
          updatedChannel
        )
        const { data: response } = await this.promise
        this.$toast.success('Updated!')
        this.channel = response
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
    },
    async markAsRead() {
      if (!this.channel.has_unread) return false
      const marker = [
        {
          name: 'channel:' + this.channel.id,
          id: this.channel.recent_message_id
        }
      ]
      try {
        this.promise = this.$axios.$post('/markers', marker)
        await this.promise
        this.$toast.success('Marked channel as read!')
        this.channel.has_unread = false
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
    }
  },
  head() {
    const title = this.isPM ? `Room ${this.channel.id}` : this.chat.name
    return {
      title
    }
  },
  computed: {
    ...mapState(['user']),
    isModerator() {
      return (
        this.user &&
        (this.user.id === this.channel.owner.id ||
          this.channel.acl.full.user_ids.find(id => {
            id == this.user.id
          }))
      )
    },
    isPM() {
      return this.channel.type === 'io.pnut.core.pm'
    },
    canPost() {
      return this.user && this.channel.acl.write.you
    },
    chat() {
      return this.channel.raw.find(r => {
        return r.type === 'io.pnut.core.chat-settings'
      }).value
    }
  },
  components: {
    List,
    MessageCompose,
    CustomCheckbox,
    Avatar
  }
}
</script>
<style scoped lang="scss">
.pm-ul {
  margin-bottom: 0;
}
</style>
