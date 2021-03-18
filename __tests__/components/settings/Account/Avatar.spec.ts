import Vue from 'vue'
import { mount, Wrapper } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { shallowMount, fixtures } from '../../../helper'
import Avatar from '~/components/molecules/settings/Account/Avatar.vue'
import { User } from '~/entity/user'

describe('Avatar component', () => {
  const oldAvatar = fixtures<User>('user').content!!.avatar_image
  const newAvatar: User.UserImage = {
    ...oldAvatar,
    link: 'https://example.com/newAvatar.png',
  }

  function findElements(wrapper: Wrapper<Vue>) {
    return {
      get input() {
        return wrapper.find('input[type="file"]')
      },
      get image() {
        return wrapper.find('img')
      },
      get changeButton() {
        return wrapper.find('button')
      },
      get removeButton() {
        return wrapper.find('button:nth-of-type(2)')
      },
    }
  }

  test('input receive change event if button is clicked', async () => {
    const handler = jest.fn()
    const wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar,
      },
    })
    const { input, changeButton } = findElements(wrapper)
    input.element.onclick = handler
    await changeButton.trigger('click')
    await flushPromises()
    expect(handler).toHaveBeenCalled()
  })

  test('keep old avatar if user does not pick images', async () => {
    const wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar,
      },
    })
    const { input, image } = findElements(wrapper)
    await input.trigger('change')
    await flushPromises()
    expect(image.attributes('src')).toBe(oldAvatar.link)
  })

  test('show error toast if throw exception in internal', async () => {
    const error = jest.fn()
    const success = jest.fn()
    const wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar,
      },
      mocks: {
        $toast: {
          success,
        },
        $interactors: {
          updateAvatar: {
            run() {
              return Promise.reject(new Error('error'))
            },
          },
        },
      },
      parentComponent: {
        errorCaptured() {
          error()
          return false
        },
      },
    })
    const els = findElements(wrapper)
    const file = new File([''], 'test')
    const files: FileList = {
      item: () => file,
      length: 1,
    }
    Object.defineProperty(els.input.element, 'files', {
      value: files,
    })
    await els.input.trigger('change')
    await flushPromises()
    expect(error).toHaveBeenCalled()
    expect(success).not.toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading avatar', async () => {
    const success = jest.fn()
    const error = jest.fn()
    const wrapper = shallowMount(Avatar, {
      propsData: {
        avatar: oldAvatar,
      },
      mocks: {
        $toast: {
          success,
        },
        $interactors: {
          updateAvatar: {
            run() {
              return Promise.resolve({
                avatar: newAvatar,
              })
            },
          },
        },
      },
      parentComponent: {
        errorCaptured() {
          error()
          return false
        },
      },
    })
    const els = findElements(wrapper)
    const file = new File([''], 'test')
    const files = [file]
    const fileList: FileList = {
      item: (index) => files[index],
      ...files,
      length: files.length,
    }
    Object.defineProperty(els.input.element, 'files', {
      value: fileList,
    })
    await els.input.trigger('change')
    await flushPromises()

    expect(success).toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    const src = els.image.attributes('src')
    expect(src).not.toBe(oldAvatar.link)
    expect(src).toBe(newAvatar.link)
  })

  test('Remove avatar and set default avatar', async () => {
    const success = jest.fn()
    const error = jest.fn()
    const wrapper = mount(Avatar, {
      propsData: {
        avatar: newAvatar,
      },
      mocks: {
        $toast: {
          success,
        },
        $interactors: {
          updateAvatar: {
            run() {
              return Promise.resolve({
                avatar: {
                  ...oldAvatar,
                  is_default: true,
                },
              })
            },
          },
        },
      },
      stubs: {
        'b-modal': true,
      },
      parentComponent: {
        errorCaptured() {
          error()
          return false
        },
      },
    })
    const els = findElements(wrapper)
    await els.removeButton.trigger('click')
    wrapper.find('b-modal-stub').vm.$emit('ok')
    await flushPromises()
    expect(success).toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    const src = els.image.attributes('src')
    expect(src).not.toBe(newAvatar.link)
    expect(src).toBe(oldAvatar.link)
    expect(els.removeButton.exists()).toBe(false)
  })
})
