import request from 'supertest'
import koaApp from '../../app'
import mock from 'mock-require'
mock('passport-pnut', 'passport-mocked')

export const app = request()
export class ServerHepler {
  constructor() {
    this.app = koaApp
    this.server = null
    this.context = null
  }
  listen() {
    this.server = this.app.listen()
    return this
  }
  get client() {
    return request(this.server)
  }
  close() {
    if (this.server) {
      this.server.close()
    }
  }
}
