<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <div
      v-if="!show"
      key="censored"
    >
      <div class="card my-2 mr-3 border-danger text-danger">
        <div class="card-body">
          <div class="media">
            <div class="media-body align-self-center">
              <p class="mb-0">
                This post includes NSFW.
              </p>
            </div>
            <button
              class="btn btn-outline-primary"
              @click="toggle"
            >
              Show
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      key="content"
    >
      <slot />
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Nsfw',
  props: {
    includeNsfw: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accept: false
    }
  },
  computed: {
    show() {
      return this.accept || !this.includeNsfw
    }
  },
  methods: {
    toggle() {
      this.accept = !this.accept
    }
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
