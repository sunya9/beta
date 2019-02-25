<template>
  <div v-if="internalPoll">
    <p>{{ internalPoll.prompt }}</p>
    <ul class="list-unstyled mb-3">
      <li
        v-for="(option, index) in internalPoll.options"
        :key="index"
        class="mb-1"
      >
        <a
          v-if="!finished"
          :class="{ disabled: !votable }"
          class="btn btn-outline-primary btn-block"
          @click="respond(option.position)"
        >
          <emojify :text="option.text" />
        </a>
        <div v-else>
          <div
            class="progress position-relative"
            style="height: 2rem"
            @click="toggleDisplay"
          >
            <div
              :style="getStyle(option)"
              class="progress-bar"
            >
              <div
                class="position-absolute w-100"
                style="right: 0; left: 0;"
              >
                <div class="mx-3 d-flex justify-content-between">
                  <emojify :text="option.text" />
                  <span>
                    <span>
                      <font-awesome-icon
                        v-if="option.is_your_response"
                        icon="check"
                        fixed-width
                        size="lg"
                      />
                    </span>
                    <span v-if="preferPercent">
                      {{ getPercent(option) }}%
                    </span>
                    <span v-else>
                      {{ option.respondents }}
                    </span>
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
        <li
          v-if="finished"
          class="list-inline-item text-muted"
        >
          Total: {{ total }}
        </li>
        <li class="list-inline-item text-muted">
          <nuxt-link
            :to="`/polls/${internalPoll.id}`"
            class="text-muted"
          >
            <font-awesome-icon
              :icon="['far', 'clock']"
              class="mr-2"
            />
            <span v-if="closed">
              Closed at
            </span><span v-else>
              ~
            </span>
            {{ until }}
          </nuxt-link>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash'
export default {
  props: {
    poll: {
      type: Object,
      default: null
    },
    pollId: {
      type: String,
      default: ''
    },
    pollToken: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentTime: Date.now(),
      timer: null,
      preferPercent: true,
      internalPoll: cloneDeep(this.poll)
    }
  },
  computed: {
    votable() {
      return this.$store.getters.user && !this.closed
    },
    finished() {
      return this.internalPoll.you_responded || this.closed
    },
    until() {
      return moment(this.internalPoll.closed_at).format('llll')
    },
    closed() {
      return new Date(this.internalPoll.closed_at).getTime() < this.currentTime
    },
    total() {
      return this.internalPoll.options.reduce(
        (sum, option) => sum + (option.respondents || 0),
        0
      )
    },
    id() {
      return this.internalPoll.id || this.internalPoll.poll_id
    }
  },
  async mounted() {
    this.timer = setInterval(this.updateTime, 1000)
    await this.getPoll()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    async getPoll() {
      const { data } = await this.$axios.$get(
        `/polls/${this.pollId || this.internalPoll.id}?poll_token=${this
          .pollToken || this.internalPoll.poll_token}`
      )
      this.internalPoll = data
    },
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
        `/polls/${this.id}/response/${position}?poll_token=${this.pollToken ||
          this.internalPoll.poll_token}`
      )
      this.internalPoll = data
    },
    async toggleDisplay() {
      this.preferPercent = !this.preferPercent
      this.getPoll()
    }
  }
}
</script>
<style scoped>
.btn {
  white-space: normal;
}
.progress {
  cursor: pointer;
}
</style>
