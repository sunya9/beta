import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import fixtures from './fixtures'
const mock = new MockAdapter(axios)

mock.onAny(/\/200/).reply(200, {
  meta: {
    more: false,
  },
  data: [],
})

mock.onPut(/\/users\/\d+\/follow/).reply(200, {
  data: {
    you_follow: true,
  },
})
mock.onDelete(/\/users\/\d+\/follow/).reply(200, {
  data: {
    you_follow: false,
  },
})
mock.onDelete(/\/users\/\d+\/block/).reply(200, {
  data: {
    you_follow: false,
    you_blocked: false,
  },
})
mock.onAny(/\/users\/\d+\//).reply(200, {
  data: {},
})
mock.onAny(/\/posts/).reply(200)
mock.onAny(/\/test/).reply(200)
mock.onPost(/\/users\/me\/avatar/).reply(200, {
  meta: {},
  data: fixtures('user', 'newAvatar'),
})

mock.onGet(/\/messages\/\d+/).reply(200, {
  meta: {},
  data: fixtures('channel'),
})

mock.onGet(/\/users\/me\/channels\/existing_pm\?ids=@bob/).reply(200, {
  meta: {},
  data: fixtures('channel'),
})

mock.onGet(/\/users\/me\/channels\/existing_pm\?ids=@carol/).reply(404, {
  meta: {
    code: 404,
  },
  data: {},
})

mock.onPost(/\/channels\/\d+\/messages/).reply(201, {
  meta: {
    code: 201,
  },
  data: fixtures('channel'),
})

mock.onGet('/polls/1?poll_token=poll_token').reply(200, {
  data: fixtures('poll', 'detail'),
})

export default mock
