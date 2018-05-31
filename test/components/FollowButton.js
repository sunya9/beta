import FollowButton from '~/components/FollowButton'
import { mount } from 'helpers/client'

describe('FollowButton component', () => {
  let wrapper
  const baseProfile = {
    you_follow: false,
    id: 1,
    you_blocked: false
  }

  context('not follow', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile
          }
        }
      })
    })
    it('Text is "Follow"', () => {
      expect(wrapper.text()).to.equal('Follow')
    })
    it('To be "following" when succeed in follow', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).to.equal('Following')
    })
  })
  context('following', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_follow: true
          }
        }
      })
    })
    it('Text is "Following"', () => {
      expect(wrapper.text()).to.equal('Following')
    })
    it('To be "Follow" when succeed in unfollow', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).to.equal('Follow')
    })
  })
  context('Blocked an user', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_blocked: true
          }
        }
      })
    })
    it('Text is "Unblock"', () => {
      expect(wrapper.text()).to.equal('Unblock')
    })
    it('Text is "Follow" when unblock', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).to.equal('Follow')
    })
  })
})
