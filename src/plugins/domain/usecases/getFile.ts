import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralFileParameters } from '~/plugins/domain/dto/file'
import { PnutResponse } from '~/entity/pnut-response'
import { File } from '~/entity/file'

interface Input {
  id: string
  params?: GeneralFileParameters
}

interface Output {
  res: PnutResponse<File>
}

export interface GetFileUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetFileUseCase {
  export const token = class {}
}

@singleton()
export class GetFileInteractor implements GetFileUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const params: GeneralFileParameters = {
      ...input.params,
    }
    const res = await this.pnutRepository.getFile({ file_id: input.id }, params)
    return {
      res,
    }
  }
}
