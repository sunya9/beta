<template>
  <span
    v-if="hasEntities && !deleted">
    <template v-if="spoiler && !showSpoiler">
      <button
        class="btn btn-link mr-3 btn-primary"
        type="button"
        @click="toggleSpoiler">
        <span class="d-sm-inline ml-2">Show Spoiler:
          <span v-emojify>{{ spoiler.topic }}</span>
        </span>
      </button>
    </template>
    <template v-else-if="!longpost || !showLongpost">
      <span class="apply-pre">
        <template v-for="(entity, i) in entities">
          <nuxt-link
            v-emojify
            v-if="entity.type === 'mentions'"
            :to="`/@${entity.text}`"
            :key="`mention-${i}`">@{{ entity.text }}</nuxt-link>
          <nuxt-link
            v-emojify
            v-else-if="entity.type === 'tags'"
            :to="`/tags/${entity.text}`"
            :key="`tags-${i}`">#{{ entity.text }}</nuxt-link>
          <template v-else-if="entity.type === 'links'">
            <nuxt-link-mod
              v-emojify
              :to="entity.replace ? entity.replace.link : entity.link"
              :key="`links-${i}`"
              target="_new">{{ replaceLinkText(entity) }}</nuxt-link-mod>
            <span
              v-if="entity.amended_len"
              :key="`links-${i}-domain`"
            > {{ entity.replace ? `[${entity.replace.domain}]` : unicodeSubstring(entity.text, entity.len, entity.amended_len ) }}</span>
            <a
              v-if="entity.replace"
              :key="`links-${i}-replaced-icon`"
              :data-content="`<a href='${entity.link}' target='_new'>${entity.link}</a>`"
              data-toggle="popover"
              data-trigger="click"
              href="#"
              class="mx-1"
              @click.prevent
            >
              <font-awesome-icon
                icon="info-circle"
              />
            </a>
          </template>
          <span
            v-emojify
            v-else
            :key="`text-${i}`">{{ entity.text }}</span>
        </template>
      </span>
      <template v-if="longpost">
        <button
          class="btn btn-link mr-3 btn-primary"
          style="margin-top:.8em;display:block"
          type="button"
          @click="toggleLongpost">
          <font-awesome-icon
            icon="plus"
            aria-hidden="true"/> Expand Post
        </button>
      </template>
    </template>
    <template v-else>
      <h5
        v-emojify
        v-if="longpost.title">{{ longpost.title }}</h5>
      <span v-emojify>{{ longpost.body }}</span>
      <div style="margin-top:.8em">
        <button
          class="btn btn-link mr-3 btn-primary"
          type="button"
          @click="toggleLongpost">
          <font-awesome-icon
            icon="minus"
            aria-hidden="true"/> Collapse Post
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
import NuxtLinkMod from '~/components/NuxtLinkMod'

export default {
  components: {
    NuxtLinkMod
  },
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    deleted: {
      type: Boolean,
      default: false
    },
    spoiler: {
      type: Object,
      default: null
    },
    longpost: {
      type: Object,
      default: null
    }
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
      const {
        links: originalLinks,
        mentions: originalMentions,
        tags: originalTags
      } = entities
      const links = addTypeKey(originalLinks, 'links')
      const mentions = addTypeKey(originalMentions, 'mentions')
      const tags = addTypeKey(originalTags, 'tags')
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
          const pos = prev.pos + (prev.amended_len || prev.len)
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
  mounted() {
    // ensure to initialize
    const { Popover } = require('bootstrap.native')
    Array.from(this.$el.querySelectorAll('[data-toggle="popover"]')).forEach(
      target => new Popover(target)
    )
  },
  methods: {
    unicodeSubstring,
    toggleSpoiler() {
      this.showSpoiler = !this.showSpoiler
    },
    toggleLongpost() {
      this.showLongpost = !this.showLongpost
    },
    replaceLinkText(entity) {
      const text = unicodeSubstring(entity.text, 0, entity.len)
      const isURLLiteral = entity.link === entity.text
      // Unsubstituted link
      if (!entity.replace || !isURLLiteral) return text
      return entity.replace.link
    }
  }
}

function addTypeKey(entities, value) {
  return entities.map(entity => {
    entity.type = value
    if (value === 'links') entity.replace = modifyURL(entity)
    return entity
  })
}

const ReplaceUrls = [
  {
    test: /^https?:\/\/patter.chat\/room\/(\d+)/,
    replace: 'https://beta.pnut.io/messages/$1',
    domain: 'beta.pnut.io'
  }
]

function modifyURL(entity) {
  const itemToReplace = ReplaceUrls.find(({ test }) => test.test(entity.link))
  if (!itemToReplace) return null
  const { test, replace, domain } = itemToReplace
  const link = entity.link.replace(test, replace)
  return {
    link,
    domain
  }
}
</script>
<style scoped>
.apply-pre >>> * {
  white-space: pre-wrap;
}
</style>
