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
        class="form-group">
        <div class="input-group">
          <div class="input-group-append">
            <button
              type="button"
              class="btn handle">
              <font-awesome-icon icon="bars"/>
            </button>
          </div>
          <input
            :placeholder="`Choice ${index + 1} ${index > 1 ? '(Optional)' : ''}`"
            v-model="choice.text"
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
              @click="removeChoice(index)">
              <font-awesome-icon icon="times"/>
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
        <font-awesome-icon
          icon="plus"
          class="mr-2"
        />
        <span>Add a choice</span>
      </button>
    </div>

    <div class="input-group d-inline-sm duration">
      <div class="input-group-prepend">
        <span class="input-group-text">Duration:</span>
      </div>

      <select
        v-model.number="dateForm.days"
        class="form-control">
        <option
          v-for="n in days.max - days.offset + 1"
          :key="n">{{ n + days.offset - 1 }}</option>
      </select>
      <div class="input-group-append input-group-prepend">
        <span class="input-group-text">
          <span
            class="d-md-none"
            title="days">d</span>
          <span class="d-none d-sm-inline">Days</span>
        </span>
      </div>

      <select
        v-model.number="dateForm.hours"
        class="form-control">
        <option
          v-for="n in hours.max - hours.offset"
          :key="n">{{ n + hours.offset - 1 }}</option>
      </select>
      <div class="input-group-append input-group-prepend">
        <span class="input-group-text">
          <span
            class="d-md-none"
            title="hours">h</span>
          <span class="d-none d-sm-inline">Hours</span>
        </span>
      </div>

      <select
        v-model.number="dateForm.min"
        class="form-control">
        <option
          v-for="n in min.max - min.offset"
          :key="n">{{ n + min.offset - 1 }}</option>
      </select>
      <div class="input-group-append">
        <span class="input-group-text">
          <span
            class="d-md-none"
            title="min">m</span>
          <span class="d-none d-sm-inline">Min</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

const ONE_DAY_MINUTE = 1440
const PER_HOUR = 60

export default {
  components: {
    draggable
  },
  data() {
    return {
      poll: {
        options: [{ text: '' }, { text: '' }],
        duration: ONE_DAY_MINUTE,
        type: 'net.unsweets.beta',
        is_public: true,
        prompt: ''
      },
      dateForm: {
        days: 1,
        hours: 0,
        min: 0
      }
    }
  },
  computed: {
    reached() {
      return this.poll.options.length >= 10
    },
    maxDays() {
      return this.dateForm.days === 14
    },
    days() {
      return {
        max: 14,
        offset: 0
      }
    },
    hours() {
      return {
        offset: 0,
        max: this.maxDays ? 1 : 24
      }
    },
    min() {
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
    },
    minDuration() {
      return this.dateForm.days === 0 && this.dateForm.hours === 0
    }
  },
  watch: {
    poll: {
      deep: true,
      handler(poll) {
        this.$emit('update:poll', poll)
      },
      immediate: true
    },
    dateForm: {
      deep: true,
      handler(dateForm) {
        new Array('hours', 'min').forEach(key => {
          const limitation = this[key]
          if (this.dateForm[key] < limitation.offset) {
            this.dateForm[key] = limitation.offset
          }
          if (this.dateForm[key] >= limitation.max) {
            this.dateForm[key] = limitation.max - 1
          }
        })
        this.poll.duration =
          dateForm.days * ONE_DAY_MINUTE +
          dateForm.hours * PER_HOUR +
          dateForm.min
      },
      immediate: true
    }
  },
  methods: {
    addChoice() {
      this.poll.options.push({ text: '' })
    },
    removeChoice(i) {
      this.poll.options.splice(i, 1)
    }
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
