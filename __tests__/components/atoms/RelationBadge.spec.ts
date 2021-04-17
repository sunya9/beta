import { mount } from '@vue/test-utils'
import { authedAccessor } from '~/../__tests__/helper'
import RelationBadge from '~/components/atoms/RelationBadge.vue'
import * as userFixtures from '~/fixtures/user'

describe('RelationBadge', () => {
  test('render badge', () => {
    const user = userFixtures.followerUser
    const wrapper = mount(RelationBadge, {
      propsData: {
        user,
      },
      mocks: {
        $accessor: authedAccessor,
      },
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.element).toBeVisible()
    expect(wrapper.text()).toContain('Follows you')
  })
  test('hide when not followed', () => {
    const wrapper = mount(RelationBadge, {
      propsData: {
        user: userFixtures.anotherUser,
      },
      mocks: {
        $accessor: authedAccessor,
      },
    })
    expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE)
    expect(wrapper.text()).not.toContain('Follows you')
  })

  test("hide when it's me", () => {
    const wrapper = mount(RelationBadge, {
      propsData: {
        user: userFixtures.myselfEntity,
      },
      mocks: {
        $accessor: authedAccessor,
      },
    })
    expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE)
    expect(wrapper.text()).not.toContain('Follows you')
  })
})
