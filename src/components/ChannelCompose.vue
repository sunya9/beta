<template>
  <div class="card mb-4 compose">
    <div class="card-body">
      <form @submit.prevent="submit">
        <div class="form-group">
          <div class="form-group">
            <input
              v-model="chat.name"
              :disabled="processing"
              type="text"
              placeholder="Name"
              class="form-control"
              maxlength="128"
              title="Up to 128 characters"
            />
          </div>
          <div class="form-group">
            <textarea
              v-model="chat.description"
              :disabled="processing"
              class="form-control"
              placeholder="Room description"
              maxlength="256"
              title="Up to 256 characters"
            />
          </div>
          <div class="form-group">
            <select
              v-model="chat.categories"
              :disabled="processing"
              class="form-control"
              multiple
            >
              <template
                v-for="i in [
                  'general',
                  'fun',
                  'lifestyle',
                  'profession',
                  'language',
                  'community',
                  'tech',
                  'event',
                ]"
              >
                <option :key="i">
                  {{ i }}
                </option>
              </template>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div />
          <div>
            <button
              :disabled="calcDisabled"
              type="submit"
              class="ml-1 btn text-uppercase btn-primary"
            >
              <font-awesome-icon
                v-show="processing"
                spin
                fixed-icon
                icon="sync"
                class="mr-1"
              />
              <span>Create</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import resettable from '~/assets/ts/resettable'

@Component({})
export default class ChannelCompose extends Mixins(resettable) {
  processing: boolean = false
  chat = {
    name: '',
    description: '',
    categories: [],
  }

  get calcDisabled(): boolean {
    return (
      !!this.processing ||
      this.chat.name.length === 0 ||
      this.chat.name.length > 128 ||
      this.chat.description.length > 256 ||
      this.chat.categories.length > 3
    )
  }

  async submit() {
    if (this.processing) return false
    this.processing = true
    try {
      const {
        res: { data: response },
      } = await this.$interactors.createChannel.run({
        name: this.chat.name,
        description: this.chat.description,
        categories: this.chat.categories,
      })
      this.$router.push(`/messages/${response.id}`)
      this.$emit('submit')
      this.reset()
    } catch (e) {
      this.$toast.error(e.message)
    } finally {
      this.processing = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.compose {
  @include no-gutter-xs;
}

textarea {
  min-height: 5rem;
}
</style>
