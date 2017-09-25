import request from 'supertest'
import koaApp from '~/app'

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
