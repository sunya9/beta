const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mock = new MockAdapter(axios)

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
mock.onAny(/\/test|\/proxy\/test/).reply(200)
mock.onPost(/\/proxy\/users\/me\/avatar/).reply(200, {
  meta: [],
  data: {
    content: {
      avatar_image: {}
    }
  }
})
