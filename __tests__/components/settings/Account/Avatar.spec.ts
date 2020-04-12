import { Wrapper } from '@vue/test-utils'
import { shallowMount, fixtures } from '../../../helper'
import Avatar from '~/components/settings/Account/Avatar.vue'
import { User } from '~/models/user'

type AvatarType = Avatar & {
  avatarChanged: (e: { target: { files: { size: number }[] } }) => Promise<void>
}

describe('Avatar component', () => {
  let wrapper: Wrapper<AvatarType>
  let $input: Wrapper<Vue>
  let $image: Wrapper<Vue>
  const oldAvatar = fixtures<User>('user').content?.avatar_image

  beforeEach(() => {
    wrapper = shallowMount<AvatarType>(Avatar, {
      propsData: {
        avatar: oldAvatar,
      },
    })
    $input = wrapper.find('input[type="file"]')
    $image = wrapper.find('img')
    wrapper.vm.$toast.error = jest.fn()
    wrapper.vm.$toast.success = jest.fn()
  })
  test('show file picker when button is clicked', () => {
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
    expect($image.attributes().src).toBe(oldAvatar?.link)
  })
  test('show error toast when file size over 2MiB', async () => {
    // const file = new File([], 'dummy')
    // $input.trigger('change')
    await wrapper.vm.avatarChanged({
      target: {
        files: [
          {
            size: 2097001,
          },
        ],
      },
    })
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
  test('show toast and update img when succeed at uploading avatar', async () => {
    await wrapper.vm.avatarChanged({
      target: {
        files: [
          new File(
            [],
            fixtures<User>('user', 'newAvatar').content!.avatar_image.link
          ),
        ],
      },
    })
    expect(wrapper.vm.$toast.success).toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).not.toHaveBeenCalled()
    expect(wrapper.vm.$el.querySelector('img')?.src).not.toBe(oldAvatar?.link)
  })
  test('throw error when failed to request', async () => {
    const $post = jest.fn(() => {
      throw new Error('error')
    })
    // const fileList: FileList = {
    //   index
    //   item(index: number) { return  }
    // }
    wrapper.vm.$axios.$post = $post
    // ;($input.element as HTMLInputElement).files = [file]
    // $input.trigger('change')
    await wrapper.vm.avatarChanged({
      target: {
        files: [{ size: 1 }],
      },
    })
    expect($post).toHaveBeenCalled()
    expect(wrapper.vm.$toast.success).not.toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
    expect(wrapper.vm.$el.querySelector('img')?.src).toBe(oldAvatar?.link)
  })
})
