import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '../../../helper'
import Cover from '~/components/settings/Account/Cover.vue'

type CoverType = Cover & {
  coverChanged: (arg: { target: { files: unknown[] } }) => Promise<void>
}

describe('Cover component', () => {
  let wrapper: Wrapper<CoverType>
  let $input: HTMLInputElement | null
  let $button: HTMLButtonElement | null
  const newCover = {
    is_default: false,
    width: 100,
    height: 100,
    link: 'http://example.com/new.png',
  }
  const oldCover = {
    link: 'http://example.com/old.png',
    width: 100,
    height: 200,
    is_default: false,
  }
  beforeEach(() => {
    wrapper = shallowMount<CoverType>(Cover, {
      propsData: {
        cover: oldCover,
      },
    })
    $input = wrapper.vm.$el.querySelector('input[type="file"]')
    $button = wrapper.vm.$el.querySelector('button')
    wrapper.vm.$toast.error = jest.fn()
    wrapper.vm.$toast.success = jest.fn()
  })
  test('show file picker when clicked button', () => {
    const picker = jest.fn()
    if ($input) {
      $input.onclick = picker
    }
    $button?.click()
    expect(picker).toHaveBeenCalled()
  })
  test('return false when not be picked', async () => {
    expect(
      await wrapper.vm.coverChanged({
        target: {
          files: [],
        },
      })
    ).toBe(false)
  })
  test('show error toast when file size over 4MiB', async () => {
    const file = {
      size: 4194001,
    }
    await wrapper.vm.coverChanged({
      target: {
        files: [file],
      },
    })
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading cover', async () => {
    const file = new Blob([])
    wrapper.vm.$axios.$post = jest.fn().mockReturnValue(
      Promise.resolve({
        data: {
          content: {
            cover_image: newCover,
          },
        },
      })
    )
    wrapper.vm.$toast.success = jest.fn()
    wrapper.vm.$toast.error = jest.fn()
    try {
      await wrapper.vm.coverChanged({
        target: {
          files: [file],
        },
      })
    } catch (e) {
      console.error('error', e)
    }
    // await wrapper.vm.$nextTick()
    expect(wrapper.vm.$toast.success).toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).not.toHaveBeenCalled()
    const $img: HTMLImageElement | null = wrapper.vm.$el.querySelector('img')
    expect($img?.src).toBe(newCover.link)
  })
  test('throw error when failed to request', async () => {
    const file = new Blob([])
    const $post = jest.fn(() => {
      throw new Error('error')
    })
    wrapper.vm.$axios.$post = $post
    await wrapper.vm.coverChanged({
      target: {
        files: [file],
      },
    })
    expect($post).toHaveBeenCalled()
    expect($post).toThrow()
    expect(wrapper.vm.$toast.success).not.toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
    const $img: HTMLImageElement | null = wrapper.vm.$el.querySelector('img')
    expect($img?.src).toBe(oldCover.link)
  })
})
