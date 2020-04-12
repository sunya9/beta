<template>
  <channel-panel :channel.sync="channel">
    <emojify slot="title" :text="$metaInfo.title" />
    <template slot="memberList">
      <channel-user-list
        v-if="!channel.acl.write.any_user"
        :owner="channel.owner"
        :users="channel.acl.write.user_ids"
        kind="write"
        no-heading
      />
    </template>
  </channel-panel>
</template>
<script lang="ts">
import ChannelUserList from '~/components/ChannelUserList.vue'
import ChannelPanel from '~/components/ChannelPanel.vue'
import { BaseChannelPanel } from '~/components/BaseChannelPanel'

export default BaseChannelPanel.extend({
  components: {
    ChannelPanel,
    ChannelUserList,
  },
  head() {
    return {
      title: `Room ${this.channel.id}`,
    }
  },
})
</script>
