import { mount } from '@vue/test-utils'
import { getUserFixture } from '~/fixtures'
import MuteButton from '~/components/atoms/MuteButton.vue'

describe('MuteButton', () => {
  test('render', () => {
    const user = getUserFixture()
    const wrapper = mount(MuteButton, {
      propsData: {
        profile: user,
      },
    })
    expect(wrapper.vm).toBeTruthy()
    const buttonWrapper = wrapper.find('button')
    expect(buttonWrapper.exists()).toBe(true)
  })
  test('mute', async () => {
    const user = getUserFixture({
      you_muted: false,
    })
    const updateRelation = {
      run: jest.fn().mockReturnValue({
        res: {
          data: {
            ...user,
            you_muted: true,
          },
        },
      }),
    }
    const wrapper = mount(MuteButton, {
      propsData: {
        profile: user,
      },
      mocks: {
        $interactors: {
          updateRelation,
        },
      },
    })
    const buttonWrapper = wrapper.find('button')
    await buttonWrapper.trigger('click')
    expect(wrapper.emitted('update:profile')?.[1][0]).toStrictEqual({
      ...user,
      you_muted: true,
    })
    expect(wrapper.emitted('update:profile')?.length).toBe(2)
    expect(updateRelation.run).toBeCalled()
  })

  test('unmute', async () => {
    const user = getUserFixture({
      you_muted: true,
    })
    const updateRelation = {
      run: jest.fn().mockReturnValue({
        res: {
          data: {
            ...user,
            you_muted: false,
          },
        },
      }),
    }
    const wrapper = mount(MuteButton, {
      propsData: {
        profile: user,
      },
      mocks: {
        $interactors: {
          updateRelation,
        },
      },
    })
    const buttonWrapper = wrapper.find('button')
    await buttonWrapper.trigger('click')
    expect(wrapper.emitted('update:profile')?.[1][0]).toStrictEqual({
      ...user,
      you_muted: false,
    })
    expect(wrapper.emitted('update:profile')?.length).toBe(2)
    expect(updateRelation.run).toBeCalled()
  })

  test('rollback state when raise error', async () => {
    const user = getUserFixture({
      you_muted: false,
    })
    const updateRelation = {
      run: jest.fn().mockReturnValue(Promise.reject(new Error('error'))),
    }
    const wrapper = mount(MuteButton, {
      propsData: {
        profile: user,
      },
      mocks: {
        $interactors: {
          updateRelation,
        },
      },
    })
    const buttonWrapper = wrapper.find('button')
    await buttonWrapper.trigger('click')
    expect(wrapper.emitted('update:profile')?.[0][0]).toStrictEqual({
      ...user,
      you_muted: true,
    })
    expect(wrapper.emitted('update:profile')?.[1][0]).toStrictEqual(user)
  })
})
