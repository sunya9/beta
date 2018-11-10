<template>
  <div class="card mb-4 compose">
    <div class="card-body">
      <form @submit.prevent="submit">
        <div class="form-group">
          <div class="form-group">
            <input
              v-model="chat.name"
              :disabled="promise"
              type="text"
              placeholder="Name"
              class="form-control"
              maxlength="128"
              title="Up to 128 characters"
            >
          </div>
          <div class="form-group">
            <textarea
              v-model="chat.description"
              :disabled="promise"
              class="form-control"
              placeholder="Room description"
              maxlength="256"
              title="Up to 256 characters"/>
          </div>
          <div class="form-group">
            <select
              v-model="chat.categories"
              :disabled="promise"
              class="form-control"
              multiple>
              <template v-for="i in ['general','fun','lifestyle','profession','language','community','tech','event']">
                <option :key="i">{{ i }}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div/>
          <div>
            <button
              :disabled="calcDisabled"
              type="submit"
              class="ml-1 btn text-uppercase btn-primary">
              <font-awesome-icon
                v-show="promise"
                spin
                fixed-icon
                icon="sync"
                class="mr-1"
              />
              <span>
                Create
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import resettable from '~/assets/js/resettable'

export default {
  name: 'ChannelCompose',
  mixins: [resettable],
  data() {
    return {
      promise: null,
      chat: {
        name: '',
        description: '',
        categories: []
      }
    }
  },
  computed: {
    calcDisabled() {
      return (
        this.promise ||
        this.chat.name.length === 0 ||
        this.chat.name.length > 128 ||
        this.chat.description.length > 256 ||
        this.chat.categories.length > 3
      )
    }
  },
  methods: {
    async submit() {
      if (this.promise) return false
      this.promise = true
      const channel = {
        type: 'io.pnut.core.chat',
        raw: []
      }
      channel.raw.push({
        type: 'io.pnut.core.chat-settings',
        value: this.chat
      })
      try {
        this.promise = this.$axios.$post('/channels', channel)
        const { data: response } = await this.promise
        this.chat = {
          name: '',
          description: '',
          categories: []
        }
        this.$router.push(`/messages/${response.id}`)
        this.$emit('submit')
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
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
</style>
