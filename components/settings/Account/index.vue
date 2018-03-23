<template>
  <div>
    <div>
      <cover :cover.sync="account.content.cover_image" />
      <avatar :avatar.sync="account.content.avatar_image" />
    </div>
    <form @submit.prevent="update" action="/proxy/users/me" method="post">
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="name">
          Name
        </label>
        <div class="col-sm-12 col-md-9">
          <input type="text" id="name" name="name" v-model="name" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="description">
          Description
        </label>
        <div class="col-sm-12 col-md-9">
          <textarea v-model="description" name="content[text]" cols="30" rows="7" id="description" class="form-control"></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="timezone">
          Timezone
        </label>
        <div class="col-sm-12 col-md-9">
          <select v-model="timezone" name="timezone" cols="30" rows="7" id="timezone" class="form-control">
            <option
              v-for="t in timezones"
              :key="t"
              :value="t"
            >
              {{t}}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="locale">
          Language
        </label>
        <div class="col-sm-12 col-md-9">
          <select v-model="locale" name="locale" cols="30" rows="7" id="locale" class="form-control">
            <option
              v-for="l in locales"
              :key="l.value"
              :value="l.value">
              {{l.label}}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="ml-md-auto col-md-9">
          <input type="submit" class="btn btn-primary" value="save" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import api from '~/plugins/api'
import locales from '~/assets/js/locales'
import timezones from '~/assets/js/timezones'
import Cover from './Cover'
import Avatar from './Avatar'

export default {
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
      description: this.account.content.markdown_text,
      timezone: this.account.timezone,
      locale: this.account.locale,
      locales,
      timezones,
      promises: null
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
        await api().patch('/users/me', this.submitData)
        this.$toast.success('Updated!')
      } catch (e) {
        this.$toast.error(e.message)
      }
    }
  },
  components: {
    Cover,
    Avatar
  }
}
</script>
