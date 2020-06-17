<template>
  <div
    class="position-relative"
    @keydown.up.prevent="up"
    @keydown.down.prevent="down"
    @keydown.enter.prevent="enter"
  >
    <ul class="list-inline my-1">
      <li v-for="(user, i) in users" :key="user.id" class="list-inline-item">
        <div class="h5 mb-0">
          <span class="badge badge-dark">
            <Avatar :avatar="getUserImage(user)" size="16" />
            {{ user.name }}(@{{ user.username }})
            <button class="remove" type="button" @click="users.splice(i, 1)">
              <font-awesome-icon icon="times" size="sm" />
            </button>
          </span>
        </div>
      </li>
    </ul>
    <input
      v-model="name"
      type="text"
      class="form-control"
      placeholder="search users..."
      @input="(e) => suggest(e)"
    />
    <div v-show="suggestedUsers.length" class="dropdown-wrapper">
      <div class="dropdown-menu d-block position-relative w-100 mt-0">
        <button
          v-for="(user, i) in suggestedUsers"
          :key="user.id"
          type="button"
          class="dropdown-item"
          :class="{ active: i === select }"
          @click="addUser(user)"
        >
          <Avatar :avatar="getUserImage(user)" size="24" />
          {{ user.name }}(@{{ user.username }})
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import debounce from 'lodash/debounce'
import { User } from '~/models/user'
import Avatar from '~/components/atoms/Avatar.vue'

@Component({
  components: { Avatar },
})
export default class InputUsers extends Vue {
  name = ''
  users: User[] = []
  suggestedUsers: User[] = []

  up() {
    this.select = !this.select
      ? this.suggestedUsers.length - 1
      : this.select - 1
  }

  down() {
    this.select = (this.select + 1) % this.suggestedUsers.length
  }

  select = -1

  get selectedUser(): User | null {
    return this.suggestedUsers[this.select] || null
  }

  enter() {
    if (!this.selectedUser) return
    this.addUser(this.selectedUser)
  }

  addUser(newUser: User) {
    if (!this.users.some((user) => user.id === newUser.id)) {
      // keep unique
      this.users = [...this.users, newUser]
      this.$emit('update:users', this.users)
    }
    this.name = ''
    this.suggestedUsers = []
  }

  suggest = debounce(
    async function (this: InputUsers, e: Event) {
      if (!(e.target instanceof HTMLInputElement)) return
      const { users } = await this.$interactors.suggestUsers.run({
        name: e.target.value,
      })
      this.suggestedUsers = users
      this.select = 0
    },
    300,
    { leading: true }
  )

  getUserImage(user: User): User.UserImage | null {
    return user.content?.avatar_image || null
  }
}
</script>
<style scoped>
.dropdown-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  display: block;
}
.remove {
  border: 0;
  padding: 0.2rem;
  margin: 0;
  vertical-align: middle;
}
</style>
