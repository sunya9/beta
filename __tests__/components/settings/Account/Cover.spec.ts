import { shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import Cover from '~/components/molecules/settings/Account/Cover.vue'
import {
  UpdateCoverUseCase,
  Output,
} from '~/plugins/domain/usecases/updateCover'

describe('Cover component', () => {
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
  const updateCover: UpdateCoverUseCase = {
    run(): Promise<Output> {
      return Promise.resolve({
        cover: { ...newCover },
      })
    },
  }

  function getElements(wrapper: Wrapper<Vue>) {
    const input = wrapper.find('input')
    const $input =
      wrapper.vm.$el.querySelector<HTMLInputElement>('input[type="file"]')!!
    const $button = wrapper.vm.$el.querySelector('button')!!
    const $img = wrapper.vm.$el.querySelector('img')!!
    return {
      input,
      $input,
      $button,
      $img,
    }
  }

  test('show file picker when clicked button', () => {
    const wrapper = shallowMount(Cover, {
      propsData: {
        cover: oldCover,
      },
    })
    const { $button, $input } = getElements(wrapper)
    const picker = jest.fn()
    if ($input) {
      $input.onclick = picker
    }
    $button.click()
    expect(picker).toHaveBeenCalled()
  })
  test('keep old cover url if not be picked', async () => {
    const wrapper = shallowMount(Cover, {
      propsData: {
        cover: oldCover,
      },
    })
    const { input } = getElements(wrapper)
    await input.trigger('change')
    await flushPromises()

    expect(wrapper.find('img').attributes('src')).toBe(oldCover.link)
  })

  test('show error toast when throw exception on updateCover', async () => {
    const errorHandler = jest.fn()
    const wrapper = shallowMount(Cover, {
      propsData: {
        cover: oldCover,
      },
      mocks: {
        $interactors: {
          updateCover: {
            run() {
              return Promise.reject(new Error('Error'))
            },
          } as UpdateCoverUseCase,
        },
        $toast: {
          success: jest.fn(),
        },
      },
      parentComponent: {
        errorCaptured() {
          errorHandler()
          return false
        },
      },
    })
    const { input } = getElements(wrapper)
    const file = new File([''], 'test')
    const files: FileList = {
      item: () => file,
      length: 1,
    }
    Object.defineProperty(input.element, 'files', {
      value: files,
    })
    await input.trigger('change')
    await flushPromises()
    expect(errorHandler).toHaveBeenCalled()
    expect(wrapper.vm.$toast.success).not.toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading cover', async () => {
    const wrapper = shallowMount(Cover, {
      propsData: {
        cover: oldCover,
      },
      mocks: {
        $interactors: {
          updateCover,
        },
        $toast: {
          success: jest.fn(),
        },
      },
    })
    const { input, $img } = getElements(wrapper)
    const file = new File([''], 'test')
    const files = [file]
    const fileList: FileList = {
      item: (index) => files[index],
      ...files,
      length: files.length,
    }
    Object.defineProperty(input.element, 'files', {
      value: fileList,
    })
    await input.trigger('change')
    await flushPromises()
    expect(wrapper.vm.$toast.success).toHaveBeenCalled()
    expect($img.src).toBe(newCover.link)
  })
})
