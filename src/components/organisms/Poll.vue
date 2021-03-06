<template>
  <div v-if="internalPoll">
    <p>
      {{ internalPoll.prompt }}
      <template v-if="internalPoll.max_options != 1">
        <br />
        <em>(Up to {{ internalPoll.max_options }} options)</em>
      </template>
    </p>
    <ul class="list-unstyled mb-3">
      <li
        v-for="(option, index) in internalPoll.options"
        :key="index"
        class="mb-1"
      >
        <div v-if="votable" class="custom-control custom-checkbox">
          <input
            :id="`pos-` + option.position"
            v-model="checkedPositions"
            type="checkbox"
            :value="option.position"
            :disabled="disabledOption(option.position)"
            class="custom-control-input"
          />
          <label :for="`pos-` + option.position" class="custom-control-label">
            <emojify :text="option.text" />
          </label>
        </div>
        <div v-else>
          <div
            class="progress position-relative"
            style="height: 2rem"
            @click="toggleDisplay"
          >
            <div :style="getStyle(option)" class="progress-bar">
              <div class="position-absolute w-100" style="right: 0; left: 0">
                <div
                  class="mx-3 d-flex justify-content-between align-items-center"
                >
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
                    <span v-if="preferPercent">{{ getPercent(option) }}%</span>
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
    <a
      v-if="votable"
      class="btn btn-outline-primary btn-block"
      @click="respond()"
    >
      Save Response
    </a>
    <footer>
      <ul class="list-inline">
        <li v-if="responded || closed" class="list-inline-item text-muted">
          Total: {{ total }}
        </li>
        <li class="list-inline-item text-muted">
          <nuxt-link :to="`/polls/${internalPoll.id}`" class="text-muted">
            <font-awesome-icon :icon="['far', 'clock']" class="mr-2" />
            <span v-if="closed">Closed at</span>
            <span v-else>~</span>
            {{ until }}
          </nuxt-link>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { cloneDeep } from 'lodash'
import { Poll } from '~/entity/poll'

@Component
export default class extends Vue {
  @Prop({ required: true })
  poll!: Poll

  currentTime = Date.now()
  timer: number | null = null
  preferPercent = true
  internalPoll: Poll = cloneDeep(this.poll)

  checkedPositions: number[] = []

  get votable() {
    return this.$accessor.user && !this.closed
  }

  disabledOption(position: number) {
    return (
      this.checkedPositions.length >= this.internalPoll.max_options &&
      !this.checkedPositions.includes(position)
    )
  }

  get until() {
    return this.$dayjs(this.internalPoll.closed_at).format('llll')
  }

  get closed() {
    return new Date(this.internalPoll.closed_at).getTime() < this.currentTime
  }

  get responded() {
    return this.internalPoll.you_responded
  }

  get total() {
    return this.internalPoll.options.reduce(
      (sum, option) => sum + (option.respondents || 0),
      0
    )
  }

  get id() {
    return this.internalPoll.id
  }

  async mounted() {
    this.timer = window.setInterval(this.updateTime, 1000)
    await this.getPoll()
  }

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  async getPoll() {
    const {
      res: { data },
    } = await this.$interactors.getPoll.run({
      pollId: this.internalPoll.id,
      pollToken: this.internalPoll.poll_token,
    })
    this.internalPoll = data

    this.checkedPositions = []
    for (let i = 0; i < this.internalPoll.options.length; i++) {
      if (this.internalPoll.options[i].is_your_response) {
        this.checkedPositions.push(this.internalPoll.options[i].position)
      }
    }
  }

  updateTime() {
    this.currentTime = Date.now()
  }

  getPercent(option: Poll.PollOption) {
    if (!option.respondents || !this.total) return '0'
    return ((option.respondents / this.total) * 100)
      .toFixed(1)
      .replace(/\.0+$/, '')
  }

  getStyle(option: Poll.PollOption) {
    return {
      width: `${0 || this.getPercent(option)}%`,
    }
  }

  async respond() {
    const { data } = await this.$axios.$put(
      `/polls/${this.id}/response?poll_token=${
        this.internalPoll.poll_token
      }&positions=${this.checkedPositions.join(',')}`
    )
    this.internalPoll = data
  }

  toggleDisplay() {
    this.preferPercent = !this.preferPercent
    this.getPoll()
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
