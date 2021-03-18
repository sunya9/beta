import { inject, singleton } from 'tsyringe'
import { User } from '~/entity/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { UseCase } from '~/plugins/domain/usecases/usecase'

export interface Input {
  file?: File
}

export type Output = {
  avatar: User.UserImage
}

export interface UpdateAvatarUseCase extends UseCase<Input, Promise<Output>> {}

export namespace UpdateAvatarUseCase {
  export const token = class {}
}

const twoMb = 2097000

@singleton()
export class UpdateAvatarInteractor implements UpdateAvatarUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const file = input.file
    if (file && file.size > twoMb) {
      throw new Error('Over 2MiB.')
    }
    const user = await this.updateAvatar(file)
    if (!user.data.content) throw new Error('User not found')
    return {
      avatar: user.data.content.avatar_image,
    }
  }

  private updateAvatar(file?: File) {
    return file
      ? this.pnutRepository.updateAvatar(file)
      : this.pnutRepository.deleteAvatar()
  }
}
