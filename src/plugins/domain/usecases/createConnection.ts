// import WebSocket from 'ws'
import { inject, singleton } from 'tsyringe'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Connection } from '~/models/connection'

interface Input {
  accessToken: string
  newMessageHandler: () => void
}

interface Output {}
export interface CreateConnectionUseCase extends Usecase<Input, Output> {}

export namespace CreateConnectionUseCase {
  export const token = class {}
}

@singleton()
export class CreateConnectionInteractor implements CreateConnectionUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  run(input: Input): Output {
    const ws = new WebSocket(
      `wss://stream.pnut.io/v0/user?access_token=${input.accessToken}`
    )
    ws.addEventListener('open', () => {
      setInterval(() => ws.send('💓'), 30000)
    })
    let once = false
    ws.addEventListener('message', (data) => {
      if (!once) {
        const obj: Connection = JSON.parse(data.data)
        this.pnutRepository.getSubscribedChannels({
          connection_id: obj.meta.connection_id,
          include_read: true,
        })
        once = true
      } else {
        input.newMessageHandler()
      }
    })
    ws.addEventListener('close', () => {})
    return {}
  }
}
