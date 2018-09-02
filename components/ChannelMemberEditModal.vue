<template>
  <div
    id="channel-member-edit-modal"
    class="modal fade"
    role="dialog"
    tabindex="-1"
    aria-hidden="true">
    <div
      class="modal-dialog"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            Edit members
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <template v-if="vm">
            <div class="form-group">
              <div class="form-group">
                <h5>Access</h5>
                <custom-checkbox
                  v-model="anyUserWrite"
                  :disabled="vm.channel.acl.write.immutable">
                  Any user can write
                </custom-checkbox>
                <custom-checkbox
                  v-model="anyUserRead"
                  :disabled="vm.channel.acl.read.immutable || anyUserWrite || publicRead">
                  Any user can read
                </custom-checkbox>
                <custom-checkbox
                  v-model="publicRead"
                  :disabled="vm.channel.acl.read.immutable">
                  Publicly readable
                </custom-checkbox>
              </div>
              <div class="form-group">
                <div class="row flex-">
                  <div class="col-sm col-md-12">
                    <h5>Members</h5>
                    <div
                      v-if="!anyUserWrite || is_owner"
                      class="form-group">
                      <button
                        :disabled="disabledAdd"
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
                    <ul class="list-unstyled">
                      <li
                        v-for="(user, index) in users"
                        :key="index"
                        class="mb-2">
                        <input
                          :disabled="vm.channel.acl[user.acl].immutable || (!is_owner && users[index].acl == 'full')"
                          v-model="users[index].username"
                          type="text"
                          placeholder="Username"
                          pattern="(\w+){0,20}"
                          title="Username"
                        >
                        <select
                          :disabled="vm.channel.acl[user.acl].immutable || (!is_owner && users[index].acl == 'full')"
                          v-model="users[index].acl">
                          <option v-if="!anyUserRead">read</option>
                          <option v-if="!anyUserWrite">write</option>
                          <option
                            v-if="users[index].acl == 'full' || is_owner"
                            value="full">moderate</option>
                        </select>
                        <button
                          v-if="!vm.channel.acl[user.acl].immutable && (is_owner || users[index].acl != 'full')"
                          type="button"
                          class="btn btn-link"
                          @click="removeUser(index)">
                          <font-awesome-icon icon="times" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button
            ref="cancelButton"
            type="button"
            tabindex="1"
            class="btn btn-secondary"
            data-dismiss="modal">Cancel</button>
          <button
            class="btn btn-primary"
            tabindex="2"
            data-dismiss="modal"
            @click="ok">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '~/assets/js/bus'
import $ from 'jquery'
import Mousetrap from '~/plugins/mousetrap'
import { mapGetters } from 'vuex'
import CustomCheckbox from '~/components/CustomCheckbox'

export default {
  components: {
    CustomCheckbox
  },
  data() {
    return {
      vm: null,
      users: [],
      acl: null,
      anyUserWrite: null,
      anyUserRead: null,
      publicRead: null
    }
  },
  computed: {
    ...mapGetters(['user']),
    chat() {
      return this.vm.channel.raw.find(r => {
        return r.type === 'io.pnut.core.chat-settings'
      }).value
    },
    is_owner() {
      return this.user && this.user.id === this.vm.channel.owner.id
    },
    disabledAdd() {
      return (
        this.users.length + 1 >= 200 ||
        this.users.find(user => {
          return user.username == ''
        })
      )
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
  mounted() {
    bus.$on('showChannelMemberEditModal', this.showModal)
    $(this.$el).on('hidden.bs.modal', this.hidden)
    $(this.$el).on('shown.bs.modal', this.shown)
  },
  beforeDestroy() {
    bus.$off('showChannelMemberEditModal', this.showModal)
  },
  methods: {
    showModal(channelVM) {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
        this.vm = channelVM
        this.users.push(
          ...this.vm.channel.acl.full.user_ids.map(user => {
            return { username: user.username, acl: 'full' }
          })
        )
        this.users.push(
          ...this.vm.channel.acl.write.user_ids.map(user => {
            return { username: user.username, acl: 'write' }
          })
        )
        this.users.push(
          ...this.vm.channel.acl.read.user_ids.map(user => {
            return { username: user.username, acl: 'read' }
          })
        )
        this.acl = JSON.parse(JSON.stringify(this.vm.channel.acl))
        this.anyUserWrite = this.acl.write.any_user
        this.anyUserRead = this.acl.read.any_user
        this.publicRead = this.acl.read.public
      }
    },
    ok() {
      const updatedChannel = JSON.parse(JSON.stringify(this.vm.channel))

      this.acl.read.user_ids = this.users
        .filter(u => {
          return u.username != '' && u.acl == 'read'
        })
        .map(u => {
          return '@' + u.username.replace(/[^\w]/g, '')
        })
      this.acl.write.user_ids = this.users
        .filter(u => {
          return u.username != '' && u.acl == 'write'
        })
        .map(u => {
          return '@' + u.username.replace(/[^\w]/g, '')
        })
      this.acl.full.user_ids = this.users
        .filter(u => {
          return u.username != '' && u.acl == 'full'
        })
        .map(u => {
          return '@' + u.username.replace(/[^\w]/g, '')
        })

      if (this.vm.channel.acl.read.immutable) {
        delete this.acl.read
      }
      if (this.vm.channel.acl.write.immutable) {
        delete this.acl.write
      }
      if (this.vm.channel.acl.full.immutable || !this.is_owner) {
        delete this.acl.full
      }
      updatedChannel.acl = this.acl

      this.vm.update(updatedChannel)
    },
    shown() {
      this.$refs.cancelButton.focus()
    },
    hidden() {
      Mousetrap.unpause()
      this.vm = null
      this.users = []
      this.acl = null
    },
    dismiss() {
      if ($(this.$el).hasClass('show')) {
        $(this.$el).modal('hide')
      }
    },
    addUser() {
      if (this.anyUserWrite) {
        this.users.unshift({ username: '', acl: 'full' })
      } else if (this.anyUserRead) {
        this.users.unshift({ username: '', acl: 'write' })
      } else {
        this.users.unshift({ username: '', acl: 'read' })
      }
    },
    removeUser(i) {
      this.users.splice(i, 1)
    },
    verifyACL() {
      this.users = this.users.map(user => {
        if (this.anyUserRead && user.acl == 'read') {
          user.acl = 'write'
        } else if (this.anyUserWrite && user.acl == 'write') {
          user.acl = 'full'
        }
        return user
      })
    }
  }
}
</script>
