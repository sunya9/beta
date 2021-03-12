import { inject, singleton } from 'tsyringe'
import { User } from '~/entity/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { UseCase } from '~/plugins/domain/usecases/usecase'

export interface Input {
  file?: File
}

export type Output = {
  cover: User.UserImage
}

export interface UpdateCoverUseCase extends UseCase<Input, Promise<Output>> {}

export namespace UpdateCoverUseCase {
  export const token = class {}
}

const fourMb = 4194000

@singleton()
export class UpdateCoverInteractor implements UpdateCoverUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const file = input.file
    if (file && file.size > fourMb) {
      throw new Error('Over 4MiB.')
    }
    const user = await this.updateCover(file)
    if (!user.data.content) throw new Error('User not found')
    return {
      cover: user.data.content.cover_image,
    }
  }

  private updateCover(file?: File) {
    return file
      ? this.pnutRepository.updateCover(file)
      : this.pnutRepository.deleteCover()
  }
}
