import { mount } from '@vue/test-utils'
import RelationBadge from '~/components/atoms/RelationBadge.vue'
import { getUserFixture } from '~/fixtures'

describe('RelationBadge', () => {
  test('render badge', () => {
    const user = getUserFixture({
      you_can_follow: true,
    })
    const wrapper = mount(RelationBadge, {
      propsData: {
        user,
      },
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.element).toBeVisible()
    expect(wrapper.text()).toContain('Follows you')
  })
  test('hide when not followed', () => {
    const user = getUserFixture({
      you_can_follow: true,
      follows_you: false,
    })
    const wrapper = mount(RelationBadge, {
      propsData: {
        user,
      },
    })
    expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE)
    expect(wrapper.text()).not.toContain('Follows you')
  })

  test("hide when it's me", () => {
    const user = getUserFixture({
      you_can_follow: false,
      follows_you: true,
      you_follow: true,
    })
    const wrapper = mount(RelationBadge, {
      propsData: {
        user,
      },
    })
    expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE)
    expect(wrapper.text()).not.toContain('Follows you')
  })
})
