<template>
  <base-modal
    id="channel-member-edit-modal"
    :ok-cb="ok"
    ok-text="Update"
    title="Edit members"
    auto-focus="cancel"
    suppress-warnings
    @show="show"
    @shown="shown"
    @hidden="hidden"
  >
    <div
      v-if="acl"
      class="form-group"
    >
      <div class="form-group">
        <h5>Access</h5>
        <custom-checkbox
          v-model="anyUserWrite"
          :disabled="acl.write.immutable">
          Any user can write
        </custom-checkbox>
        <custom-checkbox
          v-model="anyUserRead"
          :disabled="acl.read.immutable || anyUserWrite || publicRead">
          Any user can read
        </custom-checkbox>
        <custom-checkbox
          v-model="publicRead"
          :disabled="acl.read.immutable">
          Publicly readable
        </custom-checkbox>
      </div>
      <div class="form-group">
        <div class="row flex-">
          <div class="col-sm col-md-12">
            <h5>Members</h5>
            <div class="form-group">
              <div
                v-if="!anyUserWrite || isOwner"
                class="input-group">
                <input
                  ref="addUserForm"
                  :disabled="disabledAdd"
                  v-model="newUser.username"
                  type="text"
                  placeholder="Username"
                  class="form-control"
                  pattern="(\w+){0,20}"
                  title="Username"
                  @keydown.enter="addUser"
                >
                <div class="input-group-append">
                  <acl-select
                    v-model="newUser.acl"
                    :any-user-read="anyUserRead"
                    :any-user-write="anyUserWrite"
                    :owner-id="owner.id"
                  />
                  <button
                    :disabled="disabledAddButton"
                    class="btn btn-link"
                    type="button"
                    @click="addUser"
                  >
                    <font-awesome-icon
                      icon="plus"
                      class="mr-1"
                    />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
            <ul class="list-unstyled">
              <li
                v-for="(user, index) in users"
                :key="user.username">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <avatar
                          :avatar="`@${user.username}`"
                          size="16"
                          max-size="16"
                        />
                      </div>
                    </div>
                    <input
                      :value="user.username"
                      type="text"
                      class="form-control"
                      readonly
                    >
                    <div class="input-group-append">
                      <acl-select
                        v-model="user.acl"
                        :any-user-read="anyUserRead"
                        :any-user-write="anyUserWrite"
                        :disabled="editDisabled(user)"
                        :your-acl="user.acl"
                        :owner-id="owner.id"
                      />
                      <button
                        :disabled="editDisabled(user)"
                        type="button"
                        class="btn btn-link"
                        @click="removeUser(index)">
                        <font-awesome-icon icon="times" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomCheckbox from '~/components/CustomCheckbox'
import BaseModal from '~/components/BaseModal'
import Avatar from '~/components/Avatar'
import AclSelect from '~/components/AclSelect'
import { cloneDeep, groupBy } from 'lodash'

export default {
  components: {
    AclSelect,
    Avatar,
    BaseModal,
    CustomCheckbox
  },
  data() {
    return {
      owner: null,
      users: [],
      acl: null,
      anyUserWrite: null,
      anyUserRead: null,
      publicRead: null,
      newUser: {
        username: '',
        acl: this.minimumPermission
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    isOwner() {
      return this.user && this.user.id === this.owner.id
    },
    disabledAdd() {
      return this.users.length + 1 >= 200
    },
    disabledAddButton() {
      return (
        this.disabledAdd ||
        !this.newUser.username ||
        this.users.find(user => user.username === this.newUser.username) ||
        this.user.username === this.newUser.username ||
        this.owner.username === this.newUser.username
      )
    },
    minimumPermission() {
      if (this.anyUserRead) return 'write'
      if (this.anyUserWrite) return 'full'
      return 'read'
    }
  },
  watch: {
    anyUserWrite(can) {
      this.acl.write.any_user = can
      if (!this.publicRead) {
        this.anyUserRead = can
      }
    },
    anyUserRead(can) {
      this.acl.read.any_user = can
      if (can) {
        this.verifyACL()
      }
    },
    publicRead(can) {
      this.acl.read.public = can
      if (!this.anyUserWrite) {
        this.anyUserRead = can
      }
      if (can) {
        this.verifyACL()
      }
    }
  },
  methods: {
    editDisabled(user) {
      const userIsModerator = !this.isOwner && user.acl === 'full'
      return this.acl[user.acl].immutable || userIsModerator
    },
    shown() {
      this.$refs.addUserForm.focus()
    },
    show(channel) {
      this.newUser = {
        username: '',
        acl: this.minimumPermission
      }
      this.owner = channel.owner
      this.acl = cloneDeep(channel.acl)
      this.users.push(
        ...this.acl.full.user_ids.map(user => ({
          username: user.username,
          acl: 'full'
        }))
      )
      this.users.push(
        ...this.acl.write.user_ids.map(user => {
          return { username: user.username, acl: 'write' }
        })
      )
      this.users.push(
        ...this.acl.read.user_ids.map(user => {
          return { username: user.username, acl: 'read' }
        })
      )
      this.anyUserWrite = this.acl.write.any_user
      this.anyUserRead = this.acl.read.any_user
      this.publicRead = this.acl.read.public
    },
    ok() {
      const usersMap = groupBy(
        this.users.filter(user => user.username),
        user => user.acl
      )
      Object.keys(usersMap).forEach(
        permission =>
          (this.acl[permission].user_ids = usersMap[permission].map(atUserStr))
      )
      if (this.acl.read.immutable) delete this.acl.read
      if (this.acl.write.immutable) delete this.acl.write
      if (this.acl.full.immutable || !this.isOwner) delete this.acl.full
      return this.acl
    },
    hidden() {
      this.users = []
      this.acl = null
    },
    addUser() {
      if (this.disabledAdd || this.disabledAddButton) return
      this.users.unshift({ ...this.newUser })
      this.newUser.username = ''
    },
    removeUser(i) {
      this.users.splice(i, 1)
    },
    verifyACL() {
      this.users = this.users.map(user => {
        if (this.anyUserRead && user.acl === 'read') {
          user.acl = 'write'
        } else if (this.anyUserWrite && user.acl === 'write') {
          user.acl = 'full'
        }
        return user
      })
    }
  }
}

function atUserStr(user) {
  return `@${user.username.replace(/[^\w]/g, '')}`
}
</script>
