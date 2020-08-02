<template>
  <div>
    <div v-if="account.content">
      <cover :cover="account.content.cover_image" />
      <avatar :avatar="account.content.avatar_image" />
    </div>
    <form action="/proxy/users/me" method="post" @submit.prevent="update">
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="name">
          Name
        </label>
        <div class="col-sm-12 col-md-9">
          <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            class="form-control"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="description">
          Description
        </label>
        <div class="col-sm-12 col-md-9">
          <textarea
            id="description"
            v-model="description"
            name="content[text]"
            cols="30"
            rows="7"
            class="form-control"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="timezone">
          Timezone
        </label>
        <div class="col-sm-12 col-md-9">
          <select
            id="timezone"
            v-model="timezone"
            name="timezone"
            cols="30"
            rows="7"
            class="form-control"
          >
            <option v-for="t in timezones" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="locale">
          Language
        </label>
        <div class="col-sm-12 col-md-9">
          <select
            id="locale"
            v-model="locale"
            name="locale"
            cols="30"
            rows="7"
            class="form-control"
          >
            <option v-for="l in locales" :key="l.value" :value="l.value">
              {{ l.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="ml-md-auto col-md-9">
          <input
            :disabled="promise"
            type="submit"
            class="btn btn-primary"
            value="save"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import Cover from './Cover.vue'
import Avatar from './Avatar.vue'
import locales from '~/assets/json/locales.json'
import timezones from '~/assets/json/timezones.json'
import { PnutResponse } from '~/entity/pnut-response'
import { User } from '~/entity/user'

@Component({
  components: {
    Cover,
    Avatar,
  },
})
export default class AccountView extends Vue {
  @Prop({
    type: Object,
    required: true,
    validator: (obj) =>
      ['name', 'content', 'locale', 'timezone'].every((key) => key in obj),
  })
  account!: User

  name = this.account.name
  description = this.account.content?.markdown_text || ''
  timezone = this.account.timezone
  locale = this.account.locale

  locales = locales
  timezones = timezones

  promise: Promise<PnutResponse<User>> | null = null

  // TODO
  get submitData(): {
    name: string
    content: {
      text: string
    }
    timezone: string
    locale: string
  } {
    return {
      name: this.name,
      content: {
        text: this.description,
      },
      timezone: this.timezone,
      locale: this.locale,
    }
  }

  async update() {
    try {
      this.promise = this.$axios.$patch<PnutResponse<User>>(
        '/users/me',
        this.submitData
      )
      await this.promise
      this.$toast.success('Updated!')
    } catch (e) {
      this.$toast.error(e.message)
    }
    this.promise = null
  }
}
</script>
