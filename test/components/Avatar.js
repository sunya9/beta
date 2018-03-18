import Avatar from '~/components/Avatar'
import { mount } from 'helpers/client'

describe('Avatar component', () => {
  let opts
  beforeEach(() => {
    opts = {
      propsData: {
        avatar: {
          link: 'http://example.com/mock.png'
        }
      }
    }
    localStorage.clear()
  })
  it('require the avatar property', () => {
    const ok = () => {
      mount(Avatar, opts)
    }
    const err = () => {
      mount(Avatar)
    }
    expect(ok).to.not.throw()
    expect(err).to.be.an.instanceof(Function) // error function
  })
  it('Be square icon when square_avatars equals `true`', async () => {
    localStorage.setItem('square_avatars', 'true')
    const wrapper = mount(Avatar, opts)
    await wrapper.vm.$nextTick()
    expect(wrapper.first('img').hasClass('rounded-circle')).to.be.false
  })
  it('be rounded icon when square_avatars not equals `true`', () => {
    expect(
      mount(Avatar, opts)
        .first('img')
        .hasClass('rounded-circle')
    ).to.be.true
  })
  it('Add w param when max-size is larger than 0', () => {
    opts.propsData.maxSize = 10
    const wrapper = mount(Avatar, opts)
    expect(wrapper.first('img').getAttribute('src')).to.have.string('?w=10')
  })
  it('size attr equals width and height', () => {
    opts.propsData.size = 32
    let img = mount(Avatar, opts).first('img')
    expect(img.getAttribute('width')).to.equal('32')
    expect(img.getAttribute('height')).to.equal('32')
    opts.propsData.size = 64
    img = mount(Avatar, opts).first('img')
    expect(img.getAttribute('width')).to.equal('64')
    expect(img.getAttribute('height')).to.equal('64')
  })
})
