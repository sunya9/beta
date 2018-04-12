<template>
  <div>
    <h1 class="h3 mb-4">
      <nuxt-link to="/messages">
        <i class="fa fa-chevron-left"></i>
        {{$metaInfo.title}}
      </nuxt-link>
    </h1>
    <div class="row">
      <div class="col-md-4 order-md-2">
        <div class="row flex-">
          <div class="col-sm col-md-12">
            <h2 class="h3">Channel info</h2>
            <div class="form-group">
              <custom-checkbox
                v-model="channel.you_subscribed"
                @change="cancelMute"
                :resource="`/channels/${channel.id}/subscribe`">
                Subscribed
              </custom-checkbox>
              <custom-checkbox
                v-model="channel.you_muted"
                @change="cancelSubscribe"
                :resource="`/channels/${channel.id}/mute`">
                Muted
              </custom-checkbox>
            </div>
          </div>
          <div class="col-sm col-md-12">
            <h2 class="h3">Subscribers</h2>
            <ul class="list-unstyled">
              <li
                v-for="user in subscribers"
                :key="user.id"
                class="mb-2"
              >
                <nuxt-link
                  class="d-flex flex-row align-items-center flex-nowrap"
                  :to="`/@${user.username}`"
                >
                  <avatar
                    :avatar="user.content.avatar_image"
                    size="24"
                    max-size="24"
                    class="mr-2"
                  />
                  <div class="d-flex align-items-baseline flex-wrap">
                    @{{user.username}}
                    <small class="ml-1 text-muted">
                      {{user.name}}
                    </small>
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-8 order-md-1">
        <message-compose v-model="message" @submit="() => $refs.list.refresh()" />
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

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  data() {
    return {
      message: ''
    }
  },
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const messagesPromise = $resource()
    const channelPromise = $axios.$get(`/channels/${params.channel}`)
    const subscribersPromise = $axios.$get(
      `/channels/${params.channel}/subscribers`
    )
    try {
      const [
        data,
        { data: channel },
        { data: subscribers }
      ] = await Promise.all([
        messagesPromise,
        channelPromise,
        subscribersPromise
      ])
      return {
        data,
        channel,
        subscribers
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
    }
  },
  head() {
    return {
      title: this.channel.owner.username
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
