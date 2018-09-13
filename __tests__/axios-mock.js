import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import fixtures from './fixtures'
const mock = new MockAdapter(axios)

mock.onAny(/\/200/).reply(200, {
  meta: {
    more: false
  },
  data: []
})

mock.onPut(/\/users\/\d+\/follow/).reply(200, {
  data: {
    you_follow: true
  }
})
mock.onDelete(/\/users\/\d+\/follow/).reply(200, {
  data: {
    you_follow: false
  }
})
mock.onAny(/\/users\/\d+\//).reply(200, {
  data: {}
})
mock.onAny(/\/posts/).reply(200)
mock.onAny(/\/test/).reply(200)
mock.onPost(/\/users\/me\/avatar/).reply(200, {
  meta: {},
  data: fixtures('profile', 'newAvatar')
})

export default mock
