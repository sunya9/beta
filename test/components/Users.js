import { mount } from 'helpers/client'
import { compileToFunctions } from 'vue-template-compiler'
import Users from '~/components/Users'

const titleComponent = compileToFunctions('<span>title</span>')

describe('Users', () => {
  it('pass the title', () => {
    const wrapper = mount(Users, {
      slots: {
        default: titleComponent
      }
    })
    expect(wrapper.find('h3').text()).to.equal('title')
  })
})
