<template>
  <channel-panel
    :channel.sync="channel"
  >
    <emojify
      slot="title"
      :text="$metaInfo.title"
    />
    <template slot="memberList">
      <channel-user-list
        v-if="!channel.acl.write.any_user"
        :user="channel.owner"
        :users="channel.acl.write.user_ids"
        kind="write"
        no-heading
      />
    </template>
  </channel-panel>
</template>
<script>
import ChannelUserList from '~/components/ChannelUserList'
import ChannelPanel from '~/components/ChannelPanel'
import BaseChannelPanel from '~/components/BaseChannelPanel'

export default {
  components: {
    ChannelPanel,
    ChannelUserList
  },
  extends: BaseChannelPanel,
  head() {
    return {
      title: `Room ${this.channel.id}`
    }
  }
}
</script>
