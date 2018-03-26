<template>
  <div class="card">
    <div class="card-body">
      <div class="row text-center">
        <div class="col-md-4">
          <h4>Clients</h4>
          <p class="display-4">{{counts.clients.created}}</p>
        </div>
        <div class="col-md-4">
          <h4>Days</h4>
          <p class="display-4">{{counts.days}}</p>
        </div>
        <div class="col-md-4">
          <h4>Files</h4>
          <p class="display-4">{{counts.files.created}}</p>
        </div>
        <div class="col-md-4">
          <h4>Messages</h4>
          <p class="display-4">{{counts.messages.created}}</p>
        </div>
        <div class="col-md-4">
          <h4>Posts</h4>
          <p class="display-4">{{counts.posts.created}}</p>
        </div>
        <div class="col-md-4">
          <h4>Users</h4>
          <p class="display-4">{{counts.users.created}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  computed: {
    counts() {
      return this.data.data.counts
    }
  },
  head() {
    return {
      title: 'Stats'
    }
  }
}
</script>
