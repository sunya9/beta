<template>
	<span class="apply-pre" v-if="hasEntities && !deleted">
    <template v-if="spoiler && !showSpoiler">
      <button class="btn btn-link mr-3 btn-primary" type="button" @click="toggleSpoiler">
        <span class="d-sm-inline ml-2">Show Spoiler:
          <span v-emojify>{{spoiler.topic}}</span>
        </span>
      </button>
    </template>
		<template v-else-if="!longpost || !showLongpost">
      <template v-for="(entity, i) in entities">
  			<nuxt-link v-emojify :to="`/@${entity.text}`" v-if="entity.type === 'mentions'" :key="`mention-${i}`">@{{entity.text}}</nuxt-link>
  			<nuxt-link v-emojify :to="`/tags/${entity.text}`" v-else-if="entity.type === 'tags'" :key="`tags-${i}`">#{{entity.text}}</nuxt-link>
  			<a :href="entity.link" target="_new" v-emojify v-else-if="entity.type === 'links'" :key="`links-${i}`">{{unicodeSubstring(entity.text, 0, entity.len)}}</a>
  			<span v-else v-emojify :key="`text-${i}`">{{entity.text}}</span>
      </template>
      <template v-if="longpost">
        <button class="btn btn-link mr-3 btn-primary" style="margin-top:.8em;display:block" type="button" @click="toggleLongpost">
          <i class="fa fa-plus" aria-hidden="true"></i> Expand Post
        </button>
      </template>
		</template>
    <template v-else>
      <h5 v-if="longpost.title" v-emojify>{{longpost.title}}</h5>
      <span v-emojify>{{longpost.body}}</span>
      <div style="margin-top:.8em">
        <button class="btn btn-link mr-3 btn-primary" type="button" @click="toggleLongpost">
          <i class="fa fa-minus" aria-hidden="true"></i> Collapse Post
        </button>
      </div>
    </template>
	</span>
	<span v-else>
		<slot />
	</span>
</template>
<script>
import unicodeSubstring from 'unicode-substring'
import stringLength from 'string-length'
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    deleted: {
      type: Boolean,
      default: false
    },
    spoiler: Object,
    longpost: Object
  },
  data() {
    return {
      showSpoiler: false,
      showLongpost: false
    }
  },
  computed: {
    hasEntities() {
      return 'entities' in this.content && 'text' in this.content
    },
    // text and entities to html
    entities() {
      const { text: orig, entities } = this.content
      const { links, mentions, tags } = entities
      addTypeKey(links, 'links')
      addTypeKey(mentions, 'mentions')
      addTypeKey(tags, 'tags')
      return [{ text: '', type: 'text', pos: 0, len: 0 }]
        .concat(links, mentions, tags, {
          text: '',
          type: 'text',
          pos: stringLength(orig),
          len: 0
        })
        .sort((a, b) => a.pos - b.pos)
        .reduce((res, cur, i, ary) => {
          if (i === 0) return res
          const prev = ary[i - 1]
          const pos = prev.pos + prev.len
          const len = cur.pos
          const text = unicodeSubstring(orig, pos, len)
          res.push({
            text,
            type: 'text',
            pos,
            len: stringLength(text)
          })
          res.push(cur)
          return res
        }, [])
        .filter(entity => !(entity.type === 'text' && entity.text === ''))
    }
  },
  methods: {
    unicodeSubstring,
    toggleSpoiler() {
      this.showSpoiler = !this.showSpoiler
    },
    toggleLongpost() {
      this.showLongpost = !this.showLongpost
    }
  }
}

function addTypeKey(entities, value) {
  return entities.map(entity => {
    entity.type = value
    return entity
  })
}
</script>
<style scoped>
.apply-pre {
  white-space: pre-wrap;
}
</style>
