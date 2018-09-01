import Avatar from '~/components/settings/Account/Avatar'
import { shallowMount } from 'helper'

describe('Avatar component', () => {
  let wrapper, $input, $button, $toast
  const newAvatar = {
    is_default: false,
    width: 100,
    height: 100,
    link: 'http://example.com/new.png'
  }
  const oldAvatar = {
    link: 'http://example.com/old.png',
    width: 100,
    height: 200,
    is_default: false
  }
  beforeEach(() => {
    wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar
      }
    })
    $input = wrapper.vm.$el.querySelector('input[type="file"]')
    $button = wrapper.vm.$el.querySelector('button')
    $toast = wrapper.vm.$toast
  })
  test('show file picker when clicked button', async () => {
    const picker = jest.fn()
    $input.onclick = picker
    $button.click()
    await wrapper.vm.$nextTick()
    expect(picker).toHaveBeenCalled()
  })
  test('return false when not be picked', async () => {
    expect(
      await wrapper.vm.avatarChanged({
        target: {
          files: []
        }
      })
    ).toBe(false)
  })
  test('show error toast when file size over 2MiB', async () => {
    const file = {
      size: 2097001
    }
    await wrapper.vm.avatarChanged({
      target: {
        files: [file]
      }
    })
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading avatar', async () => {
    const file = new File([], 'foo.png')
    wrapper.vm.$axios = {
      $post: jest.fn(() =>
        Promise.resolve({
          data: {
            content: {
              avatar_image: newAvatar
            }
          }
        })
      )
    }
    await wrapper.vm.avatarChanged({
      target: {
        files: [file]
      }
    })
    expect($toast.success).toHaveBeenCalled()
    expect($toast.error).not.toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelector('img').src).toBe(newAvatar.link)
  })
  test('throw error when failed to request', async () => {
    const file = new Blob([])
    const $post = jest.fn(() => {
      throw new Error()
    })
    wrapper.vm.$axios = {
      $post
    }
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
