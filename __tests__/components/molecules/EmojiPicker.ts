import { mount } from '@vue/test-utils'
import { Picker } from 'emoji-mart-vue-fast'
import EmojiPicker from '~/components/molecules/EmojiPicker.vue'
import EmojiButton from '~/components/atoms/EmojiButton.vue'

describe('EmojiPicker', () => {
  test('render', () => {
    const wrapper = mount(EmojiPicker)
    expect(wrapper.vm).toBeTruthy()
  })
  test('show palette when click', async () => {
    const wrapper = mount(EmojiPicker)
    const pickerWrapper = wrapper.findComponent(Picker)
    expect(pickerWrapper.element).not.toBeVisible()
    await wrapper.findComponent(EmojiButton).trigger('click')
    expect(pickerWrapper.element).toBeVisible()
    await wrapper.findComponent(EmojiButton).trigger('click')
    expect(pickerWrapper.element).not.toBeVisible()
    // TODO: click out of side test
  })
})
