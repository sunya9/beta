import { withKnobs } from '@storybook/addon-knobs'
import EntityText from './EntityText.vue'
import { Entity } from '~/entity/entity'

export default { title: 'atoms/EntityText', decorators: [withKnobs] }

const base = {
  components: { EntityText },
}

export const normal = () => ({
  ...base,
  props: {
    content: {
      type: Object,
      required: true,
      default: (): Entity.HaveEntity => {
        return {
          entities: {
            links: [
              {
                len: 3,
                link: 'https://example.com',
                pos: 4,
                text: 'bar',
              },
            ],
            mentions: [],
            tags: [],
          },
          text: 'foo bar [example.com] baz',
        }
      },
    },
  },
  template: '<entity-text :content="content" />',
})

export const deleted = () => ({
  ...base,
  template: '<entity-text deleted>deleted</entity-text>',
})

export const replaceLink = () => ({
  ...base,
  props: {
    content: {
      type: Object,
      required: true,
      default: (): Entity.HaveEntity => {
        return {
          entities: {
            links: [
              {
                len: 4,
                link: 'https://patter.chat/room/2',
                pos: 0,
                text: 'chat',
              },
            ],
            mentions: [],
            tags: [],
          },
          text: 'chat [patter.chat]',
        }
      },
    },
  },
  template: '<entity-text :content="content" />',
})
