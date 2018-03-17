const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mock = new MockAdapter(axios)

mock.onAny(/\/proxy\/users\/\d+\//).reply(200)
mock.onAny(/\/test|\/proxy\/test/).reply(200)
