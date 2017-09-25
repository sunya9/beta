<template>
    <input
      type="submit"
      :value="value"
      class="btn btn-primary"
      data-toggle="popover"
      data-container="body"
      data-placement="right"
      :data-content="message"
      @click.prevent="submit">
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import qs from 'qs'

export default {
  props: {
    value: {
      type: String,
      default: 'Save'
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    submit(e) {
      const { form } = e.target
      const method = form._method.value || form.method || 'get'
      const url = form.action
      const data = Array.prototype.slice.call(form)
        .reduce((obj, el) => {
          if (el.name !== '_method' && el.type !== 'submit') {
            const res = qs.parse(`${el.name}=${el.value}`)
            Object.assign(obj, res)
          }
          return obj
        }, {})
      axios[method](url, data)
        .then(() => 'Saved')
        .catch(() => 'Error!')
        .then(msg => {
          this.message = msg
          $(this.$el).popover('show')
          setTimeout(() => $(this.$el).popover('hide'), 3000)
        })
    }
  }
}
</script>