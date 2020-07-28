<template>
  <span v-if="hasEntities && !deleted">
    <span class="apply-pre">
      <template v-for="(entity, i) in entities">
        <nuxt-link
          v-if="entity.type === 'mentions'"
          :key="`mention-${i}`"
          :to="`/@${entity.text}`"
          v-text="`@${entity.text}`"
        />
        <emojify
          v-else-if="entity.type === 'tags'"
          :key="`tags-${i}`"
          :to="`/tags/${entity.text}`"
          :text="`#${entity.text}`"
          element="nuxt-link"
        />
        <template v-else-if="isLinks(entity)">
          <emojify
            v-if="$options.components"
            :key="`links-${i}`"
            :to="entity.replace ? entity.replace.link : entity.link"
            :element="$options.components.NuxtLinkMod"
            :text="replaceLinkText(entity)"
            target="_new"
          />
          <span
            v-if="entity.amended_len"
            :key="`links-${i}-domain`"
            v-text="
              entity.replace
                ? ` [${entity.replace.domain}]`
                : unicodeSubstring(entity.text, entity.len, entity.amended_len)
            "
          />
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
            <font-awesome-icon icon="info-circle" />
          </a>
        </template>
        <emojify v-else :key="`text-${i}`" :text="entity.text" />
      </template>
    </span>
  </span>
  <span v-else>
    <slot />
  </span>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import unicodeSubstring from 'unicode-substring'
import stringLength from 'string-length'
import BSN from 'bootstrap.native'
import NuxtLinkMod from '~/components/NuxtLinkMod.vue'
import { Entity } from '~/models/entity'

interface ExtendedLinkInfo {
  link: string
  domain: string
}

interface ModifiedLink extends Entity.Link, TypedEntity {
  replace: ExtendedLinkInfo | null
}

interface DefinitelyModifiedLink extends ModifiedLink {
  replace: ExtendedLinkInfo
}

const ReplaceUrls = [
  {
    test: /^https?:\/\/patter.chat\/room\/(\d+)/,
    replace: 'https://beta.pnut.io/channels/$1',
    domain: 'beta.pnut.io',
  },
]

function isModifiedLink(entity: Entity): boolean {
  return 'replace' in entity
}

function entityIsModifiedLink(entity: Entity): entity is ModifiedLink {
  return isModifiedLink(entity)
}

function entityIsDefinitelyModifiedLink(
  entity: Entity
): entity is DefinitelyModifiedLink {
  return entityIsModifiedLink(entity) && !!entity.replace
}

function modifyURL(entity: Entity.Link): ExtendedLinkInfo | null {
  const itemToReplace = ReplaceUrls.find(({ test }) => test.test(entity.link))
  if (!itemToReplace) return null
  const { test, replace, domain } = itemToReplace
  const link = entity.link.replace(test, replace)
  return {
    link,
    domain,
  }
}
type EntityType = 'links' | 'mentions' | 'tags' | 'text'
interface TypedEntity extends Entity {
  type: EntityType
}

function isLinkEntity(typedEntity: TypedEntity): boolean {
  return typedEntity.type === 'links'
}

function entityIsLinkEntity(
  typedEntity: TypedEntity
): typedEntity is ModifiedLink {
  return isLinkEntity(typedEntity)
}

function addTypeKey(entities: Entity[], type: EntityType): TypedEntity[] {
  return entities.map<TypedEntity>((entity) => {
    const typedEntity = {
      ...entity,
      type,
    }
    if (entityIsLinkEntity(typedEntity))
      return {
        ...typedEntity,
        replace: modifyURL(typedEntity),
      }
    return typedEntity
  })
}

function getLen(typedEntity: TypedEntity): number {
  return (
    (entityIsLinkEntity(typedEntity) && typedEntity.amended_len) ||
    typedEntity.len
  )
}

export default Vue.extend({
  name: 'EntityText',
  components: {
    /* eslint-disable vue/no-unused-components */
    NuxtLinkMod,
  },
  props: {
    content: {
      type: Object,
      required: false,
      default: null,
    } as PropOptions<Entity.HaveEntity | null>,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasEntities(): boolean {
      return (
        !!this.content && 'entities' in this.content && 'text' in this.content
      )
    },
    // text and entities to html
    entities(): TypedEntity[] {
      if (!this.content) return []
      const { text, entities } = this.content
      const orig = text
      const {
        links: originalLinks,
        mentions: originalMentions,
        tags: originalTags,
      } = entities
      const links = addTypeKey(originalLinks, 'links')
      const mentions = addTypeKey(originalMentions, 'mentions')
      const tags = addTypeKey(originalTags, 'tags')
      const firstEntity: TypedEntity = {
        text: '',
        type: 'text',
        pos: 0,
        len: 0,
      }
      return [firstEntity]
        .concat(links, mentions, tags, {
          text: '',
          type: 'text',
          pos: stringLength(orig),
          len: 0,
        })
        .sort((a, b) => a.pos - b.pos)
        .reduce<TypedEntity[]>((res, cur, i, ary) => {
          if (i === 0) return res
          const prev = ary[i - 1]
          const pos = prev.pos + getLen(prev)
          const len = cur.pos
          const text = unicodeSubstring(orig, pos, len)
          res.push({
            text,
            type: 'text',
            pos,
            len: stringLength(text),
          })
          res.push(cur)
          return res
        }, [])
        .filter((entity) => !(entity.type === 'text' && entity.text === ''))
    },
  },
  mounted() {
    // ensure to initialize
    Array.from(this.$el.querySelectorAll('[data-toggle="popover"]')).forEach(
      (target) => new BSN.Popover(target)
    )
  },
  methods: {
    unicodeSubstring,
    replaceLinkText(entity: Entity.Link): string {
      const text = unicodeSubstring(entity.text, 0, entity.len)
      const isURLLiteral = entity.link === entity.text
      // Unsubstituted link
      if (!entityIsDefinitelyModifiedLink(entity) || !isURLLiteral) return text
      return entity.replace.link
    },
    isLinks(entity: TypedEntity): entity is ModifiedLink & TypedEntity {
      return entity.type === 'links'
    },
  },
})
</script>
<style scoped>
.apply-pre >>> * {
  white-space: pre-wrap;
}
</style>
