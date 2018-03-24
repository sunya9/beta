import Avatar from '~/components/settings/Account/Avatar'
import { shallow } from 'helpers/client'
import sinon from 'sinon'

describe('Avatar component', () => {
  let wrapper, $input, $button, $toast
  const newAvatar = {
    is_default: false,
    width: 100,
    height: 100,
    link: 'http://example.com/new.png'
  }
  const oldAvatar = {
    link: 'http://example.com/old.png',
    width: 100,
    height: 200,
    is_default: false
  }
  beforeEach(() => {
    wrapper = shallow(Avatar, {
      propsData: {
        avatar: oldAvatar
      }
    })
    $input = wrapper.vm.$el.querySelector('input[type="file"]')
    $button = wrapper.vm.$el.querySelector('button')
    $toast = wrapper.vm.$toast
  })
  it('show file picker when clicked button', async () => {
    const picker = sinon.stub()
    $input.onclick = picker
    $button.click()
    await wrapper.vm.$nextTick()
    expect(picker.called).to.be.true
  })
  it('return false when not be picked', async () => {
    expect(await wrapper.vm.avatarChanged({ target: { files: [] } })).to.be
      .false
  })
  it('show error toast when file size over 2MiB', async () => {
    const file = {
      size: 2097001
    }
    await wrapper.vm.avatarChanged({ target: { files: [file] } })
    expect(wrapper.vm.$toast.error.called).to.be.true
  })
  it('show toast and update img when succeed at uploading avatar', async () => {
    const file = new File([], 'foo.png')
    wrapper.vm.$axios = {
      $post: sinon.stub().returns(
        Promise.resolve({
          data: {
            content: {
              avatar_image: newAvatar
            }
          }
        })
      )
    }
    await wrapper.vm.avatarChanged({ target: { files: [file] } })
    expect($toast.success.called).to.be.true
    expect($toast.error.called).to.be.false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelector('img').src).to.equal(newAvatar.link)
  })
  it('throw error when failed to request', async () => {
    const file = new Blob([])
    const $post = sinon.stub().throws({
      response: {
        data: {
          meta: {
            error_message: 'error'
          }
        }
      }
    })
    wrapper.vm.$axios = { $post }
    await wrapper.vm.avatarChanged({ target: { files: [file] } })
    expect($post.called).to.be.true
    expect($toast.success.called).to.be.false
    expect($toast.error.called).to.be.true
    expect(wrapper.vm.$el.querySelector('img').src).to.equal(oldAvatar.link)
  })
})
