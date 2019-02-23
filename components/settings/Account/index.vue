<template>
  <div>
    <div>
      <cover :cover="account.content.cover_image" />
      <avatar :avatar="account.content.avatar_image" />
    </div>
    <form
      action="/proxy/users/me"
      method="post"
      @submit.prevent="update"
    >
      <div class="form-group row">
        <label
          class="col-form-label col-sm-12 col-md-3"
          for="name"
        >
          Name
        </label>
        <div class="col-sm-12 col-md-9">
          <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            class="form-control"
          >
        </div>
      </div>
      <div class="form-group row">
        <label
          class="col-form-label col-sm-12 col-md-3"
          for="description"
        >
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
        <label
          class="col-form-label col-sm-12 col-md-3"
          for="timezone"
        >
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
            <option
              v-for="t in timezones"
              :key="t"
              :value="t"
            >
              {{ t }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label
          class="col-form-label col-sm-12 col-md-3"
          for="locale"
        >
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
            <option
              v-for="l in locales"
              :key="l.value"
              :value="l.value"
            >
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
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import locales from '~/assets/json/locales'
import timezones from '~/assets/json/timezones'
import Cover from './Cover'
import Avatar from './Avatar'

export default {
  components: {
    Cover,
    Avatar
  },
  props: {
    account: {
      type: Object,
      required: true,
      validator: obj =>
        ['name', 'content', 'locale', 'timezone'].every(key => key in obj)
    }
  },
  data() {
    return {
      name: this.account.name,
      description: this.account.content.text,
      timezone: this.account.timezone,
      locale: this.account.locale,
      locales,
      timezones,
      promise: null
    }
  },
  computed: {
    submitData() {
      return {
        name: this.name,
        content: {
          text: this.description
        },
        timezone: this.timezone,
        locale: this.locale
      }
    }
  },
  methods: {
    async update() {
      try {
        this.promise = this.$axios.$patch('/users/me', this.submitData)
        await this.promise
        this.$toast.success('Updated!')
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
    }
  }
}
</script>
