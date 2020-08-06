import { mount } from '@vue/test-utils'
import AppDropdown from '~/components/molecules/AppDropdown.vue'

describe('AppDropdown', () => {
  test('render', () => {
    const wrapper = mount(AppDropdown, {
      propsData: {
        value: false,
      },
      scopedSlots: {
        button: '<button>button</button>',
        default: '<div>content</div>',
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })
  test('receive input event when clicked', async () => {
    const wrapper = mount(AppDropdown, {
      propsData: {
        value: false,
      },
      scopedSlots: {
        button: '<button>button</button>',
        default: '<div id="content">content</div>',
      },
      attachTo: document.body,
    })
    const button = wrapper.find('button')

    expect(wrapper.find('#content').element).toBeFalsy()
    await button.trigger('click')
    expect(wrapper.emitted('input')?.[0][0]).toBe(true)

    await wrapper.setProps({
      value: true,
    })

    expect(wrapper.find('#content').element).toBeVisible()
    await button.trigger('click')
    expect(wrapper.emitted('input')?.[1][0]).toBe(false)

    document.dispatchEvent(new MouseEvent('click'))
    expect(wrapper.emitted('input')?.[2][0]).toBe(false)
  })
})
