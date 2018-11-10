<template>
  <span v-if="hasEntities && !deleted">
    <span class="apply-pre">
      <template v-for="(entity, i) in entities">
        <nuxt-link
          v-if="entity.type === 'mentions'"
          :to="`/@${entity.text}`"
          :key="`mention-${i}`"
        >@{{ entity.text }}</nuxt-link
        >
        <emojify
          v-else-if="entity.type === 'tags'"
          :to="`/tags/${entity.text}`"
          :text="`#${entity.text}`"
          :key="`tags-${i}`"
          element="nuxt-link"
        />
        <template v-else-if="entity.type === 'links'">
          <emojify
            :to="entity.replace ? entity.replace.link : entity.link"
            :key="`links-${i}`"
            :element="$options.components.NuxtLinkMod"
            :text="replaceLinkText(entity)"
            target="_new"
          />
          <span
            v-if="entity.amended_len"
            :key="`links-${i}-domain`">{{
              entity.replace
                ? ` [${entity.replace.domain}]`
                : unicodeSubstring(entity.text, entity.len, entity.amended_len)
            }}</span>
          <a
            v-if="entity.replace"
            :key="`links-${i}-replaced-icon`"
            :data-content="
              `<a href='${entity.link}' target='_new'>${entity.link}</a>`
            "
            data-toggle="popover"
            data-trigger="click"
            href="#"
            class="mx-1"
            @click.prevent
          >
            <font-awesome-icon icon="info-circle" />
          </a>
        </template>
        <emojify
          v-else
          :text="entity.text"
          :key="`text-${i}`" />
      </template>
    </span>
  </span>
  <span v-else> <slot /> </span>
</template>
<script>
import unicodeSubstring from 'unicode-substring'
import stringLength from 'string-length'
import NuxtLinkMod from '~/components/NuxtLinkMod'

export default {
  name: 'EntityText',
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
