import Cover from '~/components/settings/Account/Cover'
import { shallow } from 'helpers/client'
import sinon from 'sinon'

describe('Cover component', () => {
  let wrapper, $input, $button, $toast
  const newCover = {
    is_default: false,
    width: 100,
    height: 100,
    link: 'http://example.com/new.png'
  }
  const oldCover = {
    link: 'http://example.com/old.png',
    width: 100,
    height: 200,
    is_default: false
  }
  beforeEach(() => {
    wrapper = shallow(Cover, {
      propsData: {
        cover: oldCover
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
    expect(await wrapper.vm.coverChanged({ target: { files: [] } })).to.be.false
  })
  it('show error toast when file size over 4MiB', async () => {
    const file = {
      size: 4194001
    }
    await wrapper.vm.coverChanged({ target: { files: [file] } })
    expect($toast.error.called).to.be.true
  })
  it('show toast and update img when succeed at uploading cover', async () => {
    const file = new Blob([])
    wrapper.vm.$axios = {
      $post: sinon.stub().returns(
        Promise.resolve({
          data: {
            content: {
              cover_image: newCover
            }
          }
        })
      )
    }
    await wrapper.vm.coverChanged({ target: { files: [file] } })
    expect($toast.success.called).to.be.true
    expect($toast.error.called).to.be.false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$el.querySelector('img').src).to.equal(newCover.link)
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
    await wrapper.vm.coverChanged({ target: { files: [file] } })
    expect($post.called).to.be.true
    expect($toast.success.called).to.be.false
    expect($toast.error.called).to.be.true
    expect(wrapper.vm.$el.querySelector('img').src).to.equal(oldCover.link)
  })
})
