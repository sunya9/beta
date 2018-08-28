<template>
  <div class="card mb-4 no-gutter-xs">
    <div class="card-body">
      <form @submit.prevent="submit">
        <div class="form-group">
          <div class="form-group">
            <input type="text" v-model="chat.name" placeholder="Name" class="form-control"
              maxlength="128"
              title="Up to 128 characters"
              :disabled="promise"
            >
          </div>
          <div class="form-group">
            <textarea class="form-control" v-model="chat.description" placeholder="Room description" maxlength="256" title="Up to 256 characters" :disabled="promise">
            </textarea>
          </div>
          <div class="form-group">
            <select class="form-control" v-model="chat.categories" multiple :disabled="promise">
              <template v-for="i in ['general','fun','lifestyle','profession','language','community','tech','event']">
                <option :key="i">{{i}}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div></div>
          <div>
            <button type="submit" class="ml-1 btn text-uppercase btn-primary" :disabled="calcDisabled">
              <span v-show="promise">
                <i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
              </span>
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
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
        this.chat.name.length == 0 ||
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

<style scoped>
textarea {
  min-height: 5rem;
}
</style>
