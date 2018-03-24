const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mock = new MockAdapter(axios)

mock.onAny(/\/proxy\/users\/\d+\//).reply(200)
mock.onAny(/\/posts/).reply(200)
mock.onAny(/\/test|\/proxy\/test/).reply(200)
mock.onPost(/\/proxy\/users\/me\/avatar/).reply(200, {
  meta: [],
  data: {
    content: {
      avatar_image: {}
    }
  }
})
