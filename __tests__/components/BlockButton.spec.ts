import { mount } from '@vue/test-utils'
import BlockButton from '~/components/atoms/BlockButton.vue'
import { getFixtures } from '~/fixtures'

const user = getFixtures('user')

describe('BlockButton component', () => {
  test('render without crash', () => {
    const wrapper = mount(BlockButton, {
      propsData: {
        profile: user,
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })
  test('emit update event when click button', async () => {
    const run = jest.fn()
    const updateRelation = {
      run,
    }
    const wrapper = mount(BlockButton, {
      propsData: {
        profile: user,
      },
      mocks: {
        $interactors: {
          updateRelation,
        },
      },
      scopedSlots: {
        default: '<button @click="props.toggleBlock">button</button>',
      },
    })
    run.mockReturnValue({
      res: {
        data: {
          ...user,
          you_blocked: true,
        },
      },
    })
    const button = wrapper.find('button')

    await button.trigger('click')
    expect(wrapper.emitted('update:profile')?.[0][0].you_blocked).toBe(true)
    expect(wrapper.emitted('update:profile')?.[1][0].you_blocked).toBe(true)
    await wrapper.setProps({
      profile: {
        ...user,
        you_blocked: true,
      },
    })

    run.mockReturnValue({
      res: {
        data: {
          ...user,
          you_blocked: false,
        },
      },
    })
    await button.trigger('click')
    expect(wrapper.emitted('update:profile')?.[2][0].you_blocked).toBe(false)
    expect(wrapper.emitted('update:profile')?.[3][0].you_blocked).toBe(false)
  })
  test('restore state when fail', async () => {
    const run = jest
      .fn()
      .mockReturnValue(Promise.reject(new Error('network error')))
    const wrapper = mount(BlockButton, {
      propsData: {
        profile: user,
      },
      mocks: {
        $interactors: {
          updateRelation: {
            run,
          },
        },
      },
      scopedSlots: {
        default: '<button @click="props.toggleBlock">button</button>',
      },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('update:profile')?.[0][0].you_blocked).toBe(true)
    expect(wrapper.emitted('update:profile')?.[1][0].you_blocked).toBe(false)
    await wrapper.setProps({
      profile: {
        ...user,
        you_blocked: true,
      },
    })

    await button.trigger('click')
    expect(wrapper.emitted('update:profile')?.[2][0].you_blocked).toBe(false)
    expect(wrapper.emitted('update:profile')?.[3][0].you_blocked).toBe(true)
  })
})
