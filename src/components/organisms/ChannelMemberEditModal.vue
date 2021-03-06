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
    <div v-if="acl" class="form-group">
      <div class="form-group">
        <h5>Access</h5>
        <custom-checkbox v-model="anyUserWrite" :disabled="acl.write.immutable">
          Any user can write
        </custom-checkbox>
        <custom-checkbox
          v-model="anyUserRead"
          :disabled="acl.read.immutable || anyUserWrite || publicRead"
        >
          Any user can read
        </custom-checkbox>
        <custom-checkbox v-model="publicRead" :disabled="acl.read.immutable">
          Publicly readable
        </custom-checkbox>
      </div>
      <div class="form-group">
        <div class="row flex-">
          <div class="col-sm col-md-12">
            <h5>Members</h5>
            <div class="form-group">
              <div v-if="!anyUserWrite || isOwner" class="input-group">
                <input
                  ref="addUserForm"
                  v-model="newUser.username"
                  :disabled="disabledAdd"
                  type="text"
                  placeholder="Username"
                  class="form-control"
                  pattern="(\w{1,20})"
                  title="Username"
                  @keydown.enter="addUser"
                />
                <div class="input-group-append">
                  <acl-select
                    v-if="owner"
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
                    <font-awesome-icon icon="plus" class="mr-1" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
            <ul class="list-unstyled">
              <li
                v-for="(userWithAcl, index) in users"
                :key="userWithAcl.username"
              >
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <avatar
                          :avatar="userWithAcl.avatar_image"
                          size="16"
                          max-size="16"
                        />
                      </div>
                    </div>
                    <input
                      :value="userWithAcl.username"
                      type="text"
                      class="form-control"
                      readonly
                    />
                    <div class="input-group-append">
                      <acl-select
                        v-if="owner"
                        v-model="userWithAcl.acl"
                        :any-user-read="anyUserRead"
                        :any-user-write="anyUserWrite"
                        :disabled="editDisabled(userWithAcl)"
                        :your-acl="userWithAcl.acl"
                        :owner-id="owner.id"
                      />
                      <button
                        :disabled="editDisabled(userWithAcl)"
                        type="button"
                        class="btn btn-link"
                        @click="removeUser(index)"
                      >
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

<script lang="ts">
import Vue from 'vue'
import { cloneDeep, groupBy } from 'lodash'
import { Component, Watch } from 'vue-property-decorator'
import CustomCheckbox from '~/components/atoms/CustomCheckbox.vue'
import BaseModal from '~/components/molecules/BaseModal.vue'
import Avatar from '~/components/atoms/Avatar.vue'
import AclSelect from '~/components/atoms/AclSelect.vue'
import { User } from '~/entity/user'
import { Channel } from '~/entity/channel'
import { userIdsIsString, userIdIsSimpleUser } from '~/util/channel'

function atUserStr(user: Channel.UserWithAcl) {
  return `@${user.username.replace(/[^\w]/g, '')}`
}

function keyIsAclKey(key: string): key is Channel.Permission {
  return ['write', 'full', 'read'].includes(key)
}

@Component({
  components: {
    AclSelect,
    Avatar,
    BaseModal,
    CustomCheckbox,
  },
})
export default class ChannelMemberEditModal extends Vue {
  owner: User | null = null
  users: Channel.UserWithAcl[] = []
  acl: Channel.Acl | null = null
  anyUserWrite = false
  anyUserRead = false
  publicRead = false
  newUser = {
    username: '',
    avatar_image: '',
    // acl: this.minimumPermission as string
    acl: 'read' as Channel.Permission,
  }

  get user(): User | null {
    return this.$accessor.user
  }

  get isOwner(): boolean {
    return !!this.user && !!this.owner && this.user.id === this.owner.id
  }

  get disabledAdd(): boolean {
    return this.users.length + 1 >= 200
  }

  get disabledAddButton(): boolean {
    const foundSameUser = this.users.some(
      (user) =>
        !!user.username &&
        !!this.owner &&
        !!this.newUser &&
        (user.username === this.newUser.username ||
          this.user?.username === this.newUser.username ||
          this.owner.username === this.newUser.username)
    )
    return this.disabledAdd || !this.newUser.username || foundSameUser
  }

  get minimumPermission(): Channel.Permission {
    if (this.anyUserRead) return 'write'
    if (this.anyUserWrite) return 'full'
    return 'read'
  }

  @Watch('anyUserWrite')
  onChangeAnyUserWrite(can: boolean) {
    if (!this.acl) return
    this.acl.write.any_user = can
    if (!this.publicRead) {
      this.anyUserRead = can
    }
  }

  @Watch('anyUserRead')
  onChangeAnyUserRead(can: boolean) {
    if (!this.acl) return
    this.acl.read.any_user = can
    if (can) {
      this.verifyACL()
    }
  }

  @Watch('publicRead')
  onChangepublicRead(can: boolean) {
    if (!this.acl) return
    this.acl.read.public = can
    if (!this.anyUserWrite) {
      this.anyUserRead = can
    }
    if (can) {
      this.verifyACL()
    }
  }

  editDisabled(user: Channel.UserWithAcl): boolean {
    const userIsModerator = !this.isOwner && !!this.acl && user.acl === 'full'
    return (!!this.acl && this.acl[user.acl].immutable) || userIsModerator
  }

  $refs!: {
    addUserForm: HTMLInputElement
  }

  shown() {
    this.$refs.addUserForm.focus()
  }

  show(channel: Channel) {
    this.newUser = {
      username: '',
      avatar_image: '',
      acl: this.minimumPermission,
    }
    this.owner = channel.owner || null
    this.acl = cloneDeep(channel.acl)
    const fullUserIds = this.acl.full.user_ids
    if (userIdsIsString(fullUserIds)) return
    this.users.push(
      ...fullUserIds
        .filter(userIdIsSimpleUser)
        .map<Channel.UserWithAcl>((user) => ({
          ...user,
          acl: 'full',
        }))
    )
    const writeUserIds = this.acl.write.user_ids
    if (userIdsIsString(writeUserIds)) return
    this.users.push(
      ...writeUserIds
        .filter(userIdIsSimpleUser)
        .map<Channel.UserWithAcl>((user) => ({
          ...user,
          acl: 'write',
        }))
    )
    const readUserIds = this.acl.read.user_ids
    if (userIdsIsString(readUserIds)) return
    this.users.push(
      ...readUserIds
        .filter(userIdIsSimpleUser)
        .map<Channel.UserWithAcl>((user) => ({
          ...user,
          acl: 'read',
        }))
    )
    this.anyUserWrite = this.acl.write.any_user
    this.anyUserRead = this.acl.read.any_user
    this.publicRead = this.acl.read.public
  }

  ok() {
    if (!this.acl) return
    const usersMap = groupBy(
      this.users.filter((user) => user.username),
      (user) => user.acl
    )
    Object.keys(usersMap)
      .filter(keyIsAclKey)
      .forEach((permission) => {
        if (!this.acl) return
        this.acl[permission].user_ids = usersMap[permission].map(atUserStr)
      })
    if (this.acl.read.immutable) delete this.acl.read
    if (this.acl.write.immutable) delete this.acl.write
    if (this.acl.full.immutable || !this.isOwner) delete this.acl.full
    return this.acl
  }

  hidden() {
    this.users = []
    this.acl = null
  }

  addUser() {
    if (this.disabledAdd || this.disabledAddButton) return
    const newUser = this.newUser
    newUser.username = newUser.username.replace(/[^\w]/g, '')
    this.users.unshift({ ...newUser })
    this.newUser.username = ''
  }

  removeUser(i: number) {
    this.users.splice(i, 1)
  }

  verifyACL() {
    this.users = this.users.map((user) => {
      if (this.anyUserRead && user.acl === 'read') {
        user.acl = 'write'
      } else if (this.anyUserWrite && user.acl === 'write') {
        user.acl = 'full'
      }
      return user
    })
  }
}
</script>
