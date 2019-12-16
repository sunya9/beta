<template>
  <div>
    <h5>Poll</h5>
    <div class="form-group">
      <input
        v-model="poll.prompt"
        type="text"
        placeholder="Optional prompt"
        class="form-control"
        pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,256}"
        title="Up to 256 unicode characters"
      >
    </div>
    <hr>
    <draggable
      v-model="poll.options"
      :options="{
        handle: '.handle'
      }"
    >
      <div
        v-for="(choice, index) in poll.options"
        :key="index"
        class="form-group"
      >
        <div class="input-group">
          <div class="input-group-append">
            <button type="button" class="btn handle">
              <font-awesome-icon icon="bars" />
            </button>
          </div>
          <input
            v-model="choice.text"
            :placeholder="
              `Choice ${index + 1} ${index > 1 ? '(Optional)' : ''}`
            "
            type="text"
            class="form-control"
            pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,64}"
            title="Up to 64 unicode characters"
          >
          <div class="input-group-append">
            <button
              :class="{ invisible: index < 2 }"
              type="button"
              class="btn btn-link"
              @click="removeChoice(index)"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>
    </draggable>
    <div class="form-group">
      <button
        :disabled="reached"
        class="btn btn-link"
        type="button"
        @click="addChoice"
      >
        <font-awesome-icon icon="plus" class="mr-2" />
        <span>Add a choice</span>
      </button>
    </div>

    <div class="input-group d-inline-sm duration">
      <div class="input-group-prepend">
        <span class="input-group-text">
          Duration:
        </span>
      </div>

      <select v-model.number="dateForm.days" class="form-control">
        <option v-for="n in days.max - days.offset + 1" :key="n">
          {{ n + days.offset - 1 }}
        </option>
      </select>
      <div class="input-group-append input-group-prepend">
        <span class="input-group-text">
          <span class="d-md-none" title="days">
            d
          </span>
          <span class="d-none d-sm-inline">
            Days
          </span>
        </span>
      </div>

      <select v-model.number="dateForm.hours" class="form-control">
        <option v-for="n in hours.max - hours.offset" :key="n">
          {{ n + hours.offset - 1 }}
        </option>
      </select>
      <div class="input-group-append input-group-prepend">
        <span class="input-group-text">
          <span class="d-md-none" title="hours">
            h
          </span>
          <span class="d-none d-sm-inline">
            Hours
          </span>
        </span>
      </div>

      <select v-model.number="dateForm.min" class="form-control">
        <option v-for="n in min.max - min.offset" :key="n">
          {{ n + min.offset - 1 }}
        </option>
      </select>
      <div class="input-group-append">
        <span class="input-group-text">
          <span class="d-md-none" title="min">
            m
          </span>
          <span class="d-none d-sm-inline">
            Min
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import { Poll } from '~/models/poll'

const ONE_DAY_MINUTE = 1440
const PER_HOUR = 60

interface MaxOffset {
  max: number
  offset: number
}

interface DateForm {
  days: number
  hours: number
  min: number
}
@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  poll = {
    options: [{ text: '' }, { text: '' }],
    duration: ONE_DAY_MINUTE,
    type: 'net.unsweets.beta',
    is_public: true,
    prompt: ''
  }
  dateForm: DateForm = {
    days: 1,
    hours: 0,
    min: 0
  }
  get reached(): boolean {
    return this.poll.options.length >= 10
  }
  get maxDays(): boolean {
    return this.dateForm.days === 14
  }
  get days(): MaxOffset {
    return {
      max: 14,
      offset: 0
    }
  }
  get hours(): MaxOffset {
    return {
      offset: 0,
      max: this.maxDays ? 1 : 24
    }
  }
  get min(): MaxOffset {
    if (this.maxDays) {
      return {
        offset: 0,
        max: 1
      }
    } else if (this.minDuration) {
      return {
        offset: 1,
        max: 60
      }
    } else {
      return {
        offset: 0,
        max: 60
      }
    }
  }
  get minDuration(): boolean {
    return this.dateForm.days === 0 && this.dateForm.hours === 0
  }
  @Watch('poll', { immediate: true, deep: true })
  onPollChange(poll: Poll.PostBody) {
    this.$emit('update:poll', poll)
  }

  @Watch('dateForm', { deep: true, immediate: true })
  onDateFormChange(dateForm: DateForm) {
    const keys: Array<keyof DateForm> = ['hours', 'min']
    keys.forEach(key => {
      // TODO
      const limitation = (this as any)[key] as MaxOffset
      if (this.dateForm[key] < limitation.offset) {
        this.dateForm[key] = limitation.offset
      }
      if (this.dateForm[key] >= limitation.max) {
        this.dateForm[key] = limitation.max - 1
      }
    })
    this.poll.duration =
      dateForm.days * ONE_DAY_MINUTE + dateForm.hours * PER_HOUR + dateForm.min
  }

  addChoice() {
    this.poll.options.push({ text: '' })
  }
  removeChoice(i: number) {
    this.poll.options.splice(i, 1)
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

input[type='text']:invalid {
  border-color: map-get($theme-colors, danger);
}

.duration {
  [class^='input-group'] + .form-control {
    width: auto;
    padding: 0;
  }
}

.handle {
  cursor: default;
}
</style>
