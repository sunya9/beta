import Cover from '~/components/settings/Account/Cover'
import { shallowMount } from 'helper'

describe('Cover component', () => {
  let wrapper, $input, $button, $toast
  const newCover = {
    is_default: false,
    width: 100,
    height: 100,
    link: 'http://example.com/new.png'
  }
  const oldCover = {
    link: 'http://example.com/old.png',
    width: 100,
    height: 200,
    is_default: false
  }
  beforeEach(() => {
    wrapper = shallowMount(Cover, {
      propsData: {
        cover: oldCover
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
      await wrapper.vm.coverChanged({
        target: {
          files: []
        }
      })
    ).toBe(false)
  })
  test('show error toast when file size over 4MiB', async () => {
    const file = {
      size: 4194001
    }
    await wrapper.vm.coverChanged({
      target: {
        files: [file]
      }
    })
    expect($toast.error).toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading cover', async () => {
    const file = new Blob([])
    wrapper.vm.$axios = {
      $post: jest.fn().mockReturnValue(
        Promise.resolve({
          data: {
            content: {
              cover_image: newCover
            }
          }
        })
      )
    }
    await wrapper.vm.coverChanged({
      target: {
        files: [file]
      }
    })
    expect($toast.success).toHaveBeenCalled()
    expect($toast.error).not.toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelector('img').src).toBe(newCover.link)
  })
  test('throw error when failed to request', async () => {
    const file = new Blob([])
    const $post = jest.fn(() => {
      throw new Error()
    })
    wrapper.vm.$axios = {
      $post
    }
    await wrapper.vm.coverChanged({
      target: {
        files: [file]
      }
    })
    expect($post).toHaveBeenCalled()
    expect($post).toThrow()
    expect($toast.success).not.toHaveBeenCalled()
    expect($toast.error).toHaveBeenCalled()
    expect(wrapper.vm.$el.querySelector('img').src).toBe(oldCover.link)
  })
})
