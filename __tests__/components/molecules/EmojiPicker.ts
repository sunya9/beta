import { mount } from '@vue/test-utils'
import EmojiPicker from '~/components/molecules/EmojiPicker.vue'
import EmojiButton from '~/components/atoms/EmojiButton.vue'
import { Picker } from '~/plugins/emoji'

describe('EmojiPicker', () => {
  test('render', () => {
    const wrapper = mount(EmojiPicker)
    expect(wrapper.vm).toBeTruthy()
  })
  test('show palette when click', async () => {
    const wrapper = mount(EmojiPicker, {
      stubs: {
        picker: Picker,
      },
    })
    const pickerWrapper = wrapper.findComponent(Picker)
    expect(pickerWrapper.element).not.toBeVisible()
    await wrapper.findComponent(EmojiButton).trigger('click')
    expect(pickerWrapper.element).toBeVisible()
    await wrapper.findComponent(EmojiButton).trigger('click')
    expect(pickerWrapper.element).not.toBeVisible()
    // TODO: click out of side test
  })
})
