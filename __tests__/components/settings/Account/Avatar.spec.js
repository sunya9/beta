import Avatar from '~/components/settings/Account/Avatar'
import { shallowMount, fixtures } from 'helper'

describe('Avatar component', () => {
  let wrapper, $input, $toast, $image
  const oldAvatar = fixtures('user').content.avatar_image
  beforeEach(() => {
    wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar
      }
    })
    $toast = wrapper.vm.$toast
    $input = wrapper.find('input[type="file"]')
    $image = wrapper.find('img')
  })
  test('show file picker when button is clicked', async () => {
    const handler = jest.fn()
    $input.element.onclick = handler
    wrapper.find('button').trigger('click')
    expect(handler).toHaveBeenCalled()
  })
  test('Avatar does not be changed when not be picked', () => {
    const handler = jest.fn()
    $input.element.onchange = handler
    $input.trigger('change')
    expect(handler).toHaveBeenCalled()
    expect($image.attributes().src).toBe(oldAvatar.link)
  })
  test('show error toast when file size over 2MiB', async () => {
    await wrapper.vm.avatarChanged({
      target: {
        files: [
          {
            size: 2097001
          }
        ]
      }
    })
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading avatar', async () => {
    await wrapper.vm.avatarChanged({
      target: {
        files: [
          new File([], fixtures('user', 'newAvatar').content.avatar_image.link)
        ]
      }
    })
    expect($toast.success).toHaveBeenCalled()
    expect($toast.error).not.toHaveBeenCalled()
    expect(wrapper.vm.$el.querySelector('img').src).not.toBe(oldAvatar.link)
  })
  test('throw error when failed to request', async () => {
    const file = new Blob([])
    const $post = jest.fn(() => {
      throw new Error()
    })
    wrapper.vm.$axios.$post = $post
    await wrapper.vm.avatarChanged({
      target: {
        files: [file]
      }
    })
    expect($post).toHaveBeenCalled()
    expect($toast.success).not.toHaveBeenCalled()
    expect($toast.error).toHaveBeenCalled()
    expect(wrapper.vm.$el.querySelector('img').src).toBe(oldAvatar.link)
  })
  test
})
