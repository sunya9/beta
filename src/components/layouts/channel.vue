<template>
  <div>
    <div class="row">
      <div class="col-md-8">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <nuxt-link
              :class="{ active: isPm }"
              to="/channels"
              class="nav-link"
              exact
            >
              Messages
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :class="{ active: !isPm }"
              to="/channels?public"
              class="nav-link"
            >
              Chat Rooms
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class ChannelLayout extends Vue {
  @Prop({ type: Boolean, required: true })
  isPm!: boolean
}
</script>
