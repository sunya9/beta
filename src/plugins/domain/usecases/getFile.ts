import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralFileParameters } from '~/plugins/domain/dto/file'
import { PnutResponse } from '~/models/pnut-response'
import { File } from '~/models/file'

interface Input {
  id: string
  params?: GeneralFileParameters
}

interface Output {
  res: PnutResponse<File>
}

export interface GetFileUseCase extends Usecase<Input, Promise<Output>> {}

export class GetFileInteractor implements GetFileUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
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
