<template>
  <ul class="list-group my-4">
    <component :is="type" :key="item.id" v-for="item in filterItems" :data="item"></component>
  </ul>
</template>

<script>
import mousetrap from 'mousetrap'
import User from '~components/User'
import Post from '~components/Post'
import Interaction from '~components/Interaction'

export default {
  props: ['items', 'type'],
  components: {
    User,
    Post,
    Interaction
  },
  computed: {
    filterItems() {
      if (this.type === 'Post') {
        return this.items.filter(item => item.content)
      }
      return this.items
    }
  }
}
</script>