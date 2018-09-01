import { mount } from 'helper'
import { compileToFunctions } from 'vue-template-compiler'
import Users from '~/components/Users'

const titleComponent = compileToFunctions('<span>title</span>')

describe('Users', () => {
  test('pass the title', () => {
    const wrapper = mount(Users, {
      slots: {
        default: titleComponent
      }
    })
    expect(wrapper.find('h3').text()).toBe('title')
  })
})
