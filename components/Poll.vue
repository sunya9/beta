<template>
  <div class="list-group-item list-group-item-action" v-if="poll">
    <p>{{poll.prompt}}</p>
    <ul class="list-unstyled mb-3">
      <li
        v-for="(option, index) in poll.options"
        :key="index"
        class="mb-1"
      >
          <a
            class="btn btn-outline-primary btn-block"
            @click="respond(option.position)"
            v-if="!poll.you_responded && !closed">
            {{option.text}}
          </a>
          <div v-else>
            <div class="progress position-relative" style="height: 2rem">
              <div class="progress-bar" :style="getStyle(option)">
                <div class="position-absolute w-100" style="right: 0; left: 0;">
                  <div class="mx-3 d-flex justify-content-between">
                    <span>{{option.text}}</span>
                    <span>
                      <span><i class="fa fa-fw fa-lg" :class="{ 'fa-check': option.is_your_response }"></i></span>
                      {{getPercent(option)}}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </li>
    </ul>
    <footer>
      <ul class="list-inline">
        <li class="list-inline-item text-muted">
          <i class="fa fa-clock-o"></i>&nbsp;
          <span v-if="closed">Closed at</span><span v-else>~</span> {{until}}
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    data: Object,
    pollId: String
  },
  data() {
    return {
      currentTime: Date.now(),
      timer: null,
      poll: this.data
    }
  },
  async mounted() {
    this.timer = setInterval(this.updateTime, 1000)
    if (!this.poll && this.pollId) {
      const { data } = await this.$axios.$get(`/polls/${this.pollId}`)
      this.poll = data
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  computed: {
    until() {
      return moment(this.poll.closed_at).format('llll')
    },
    closed() {
      return new Date(this.poll.closed_at).getTime() < this.currentTime
    },
    total() {
      return this.poll.options.reduce(
        (sum, option) => sum + (option.respondents || 0),
        0
      )
    },
    id() {
      return this.poll.id || this.poll.poll_id
    }
  },
  methods: {
    updateTime() {
      this.currentTime = Date.now()
    },
    getPercent(option) {
      return ((option.respondents / this.total || 0) * 100)
        .toFixed(1)
        .replace(/\.0+$/, '')
    },
    getStyle(option) {
      return {
        width: `${0 || this.getPercent(option)}%`
      }
    },
    async respond(position) {
      const { data } = await this.$axios.$put(
        `/polls/${this.id}/response/${position}`
      )
      this.poll = data
      this.$emit('update:data', data)
    }
  }
}
</script>
<style scoped>
.btn {
  white-space: normal;
}
</style>
