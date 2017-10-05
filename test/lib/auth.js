import {
  ServerHepler
} from 'helpers/server'

describe('Auth', () => {
  let serverHelper, client
  beforeEach(() => {
    serverHelper = new ServerHepler()
    client = serverHelper.listen().client
  })
  afterEach(() => {
    return serverHelper.close()
  })
  describe('/login', () => {
    it('Return 302 and url equals pnut domain when request of /login', () => {
      return client.get('/login')
        .expect(302)
        .expect('Location', /^https:\/\/pnut.io\/oauth\/authenticate/)
    })
  })

  describe('/logout', () => {
    it('Always return 302 and redirect to / when request /logout', () => {
      return client.get('/logout')
        .expect(302)
        .expect('Location', '/')
    })
  })
})
