import { Wrapper } from '@vue/test-utils'
import { shallowMount, fixtures } from '../helper'
import RemoveModal from '~/components/organisms/RemoveModal.vue'
import BaseModal from '~/components/molecules/BaseModal.vue'
import { Post } from '~/entity/post'

type RemoveModalType = Vue &
  typeof RemoveModal & {
    show: () => void
    post: Partial<Post> | null
    hidden: () => void
  }

type BaseModalType = Vue & typeof BaseModal

describe('Remove modal component', () => {
  let wrapper: Wrapper<RemoveModalType>
  let baseModalWrapper: Wrapper<BaseModalType>
  beforeEach(() => {
    wrapper = shallowMount(RemoveModal, {}) as Wrapper<RemoveModalType>
    baseModalWrapper = wrapper.findComponent(BaseModal) as Wrapper<
      BaseModalType
    >
  })
  describe('Emitted show event from base-modal', () => {
    beforeEach(() => {
      wrapper.setMethods({
        show: jest.fn(),
      })
      const post = {}
      baseModalWrapper.vm.$emit('show', post)
    })
    test('Called show()', () => {
      expect(wrapper.vm.show).toHaveBeenCalled()
    })
    test('Shown the post', async () => {
      wrapper.vm.post = fixtures('post')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('post-stub').exists()).toBe(true)
    })
  })

  describe('Emitted hidden event from base-modal', () => {
    beforeEach(() => {
      wrapper.setMethods({
        hidden: jest.fn(),
      })
      baseModalWrapper.vm.$emit('hidden')
    })

    test('Called hidden()', () => {
      expect(wrapper.vm.hidden).toHaveBeenCalled()
    })
    test('The post is hidden', () => {
      expect(wrapper.find('post-stub').exists()).toBe(false)
    })
  })
})
