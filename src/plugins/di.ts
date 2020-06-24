import 'reflect-metadata'
import { Plugin, Context } from '@nuxt/types'
import { container, inject, singleton } from 'tsyringe'
import {
  CreateFileInteractor,
  CreateFileUseCase,
} from '~/plugins/domain/usecases/createFile'
import { PnutRepositoryImpl } from '~/plugins/infrastructure/pnutRepositoryImpl'
import {
  CreatePollInteractor,
  CreatePollUseCase,
} from '~/plugins/domain/usecases/createPoll'
import {
  GetFileInteractor,
  GetFileUseCase,
} from '~/plugins/domain/usecases/getFile'
import {
  CreatePostInteractor,
  CreatePostUseCase,
} from '~/plugins/domain/usecases/createPost'
import {
  UpdatePostInteractor,
  UpdatePostUseCase,
} from '~/plugins/domain/usecases/updatePost'
import {
  CreateMessageUseCase,
  CreateMessageInteractor,
} from '~/plugins/domain/usecases/createMessage'
import {
  CreateChannelUseCase,
  CreateChannelInteractor,
} from '~/plugins/domain/usecases/createChannel'
import {
  CreatePrivateChannelUseCase,
  CreatePrivateChannelInteractor,
} from '~/plugins/domain/usecases/createPrivateChannel'
import {
  SuggestUsersInteractor,
  SuggestUsersUseCase,
} from '~/plugins/domain/usecases/suggestUsers'
import {
  GetMessagesUseCase,
  GetMessagesInteractor,
} from '~/plugins/domain/usecases/getMessages'
import {
  GetPostsUseCase,
  GetPostsInteractor,
} from '~/plugins/domain/usecases/getPosts'
import {
  GetProfileWithPostsUseCase,
  GetProfileWithPostsInteractor,
} from '~/plugins/domain/usecases/getProfileWithPosts'
import {
  GetInteractionsUseCase,
  GetInteractionsInteractor,
} from '~/plugins/domain/usecases/getInteractions'
import {
  GetUsersUseCase,
  GetUsersInteractor,
} from '~/plugins/domain/usecases/getUsers'
import {
  GetChannelsUseCase,
  GetChannelsInteractor,
} from '~/plugins/domain/usecases/getChannels'
import {
  GetStatsUseCase,
  GetStatsInteractor,
} from '~/plugins/domain/usecases/getStats'
import {
  SearchUseCase,
  SearchInteractor,
} from '~/plugins/domain/usecases/search'
import {
  GetThreadUseCase,
  GetThreadInteractor,
} from '~/plugins/domain/usecases/getThread'
import {
  GetFilesUseCase,
  GetFilesInteractor,
} from '~/plugins/domain/usecases/getFiles'
import {
  GetPollsInteractor,
  GetPollsUseCase,
} from '~/plugins/domain/usecases/getPolls'
import {
  GetPollUseCase,
  GetPollInteractor,
} from '~/plugins/domain/usecases/getPoll'
import {
  GetRevisionInteractor,
  GetRevisionUseCase,
} from '~/plugins/domain/usecases/getRevision'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

function bind(context: Context) {
  container
    .register(PnutRepository.token, {
      useValue: new PnutRepositoryImpl(context.$axios),
    })
    .register(GetProfileWithPostsUseCase.token, {
      useClass: GetProfileWithPostsInteractor,
    })
    .register(GetPostsUseCase.token, { useClass: GetPostsInteractor })
    .register(CreateFileUseCase.token, { useClass: CreateFileInteractor })
    .register(CreatePollUseCase.token, { useClass: CreatePollInteractor })
    .register(GetFileUseCase.token, { useClass: GetFileInteractor })
    .register(CreatePostUseCase.token, { useClass: CreatePostInteractor })
    .register(UpdatePostUseCase.token, { useClass: UpdatePostInteractor })
    .register(CreateMessageUseCase.token, { useClass: CreateMessageInteractor })
    .register(CreateChannelUseCase.token, { useClass: CreateChannelInteractor })
    .register(CreatePrivateChannelUseCase.token, {
      useClass: CreatePrivateChannelInteractor,
    })
    .register(SuggestUsersUseCase.token, { useClass: SuggestUsersInteractor })
    .register(GetMessagesUseCase.token, { useClass: GetMessagesInteractor })
    .register(GetPostsUseCase.token, { useClass: GetPostsInteractor })
    .register(GetProfileWithPostsUseCase.token, {
      useClass: GetProfileWithPostsInteractor,
    })
    .register(GetInteractionsUseCase.token, {
      useClass: GetInteractionsInteractor,
    })
    .register(GetUsersUseCase.token, { useClass: GetUsersInteractor })
    .register(GetChannelsUseCase.token, { useClass: GetChannelsInteractor })
    .register(GetStatsUseCase.token, { useClass: GetStatsInteractor })
    .register(SearchUseCase.token, { useClass: SearchInteractor })
    .register(GetThreadUseCase.token, { useClass: GetThreadInteractor })
    .register(GetFilesUseCase.token, { useClass: GetFilesInteractor })
    .register(GetPollsUseCase.token, { useClass: GetPollsInteractor })
    .register(GetPollUseCase.token, { useClass: GetPollInteractor })
    .register(GetRevisionUseCase.token, { useClass: GetRevisionInteractor })
}

@singleton()
class Interactors {
  constructor(
    @inject(CreateFileUseCase.token) readonly createFile: CreateFileUseCase,
    @inject(CreatePollUseCase.token) readonly createPoll: CreatePollUseCase,
    @inject(GetFileUseCase.token) readonly getFile: GetFileUseCase,
    @inject(CreatePostUseCase.token) readonly createPost: CreatePostUseCase,
    @inject(UpdatePostUseCase.token) readonly updatePost: UpdatePostUseCase,
    @inject(CreateMessageUseCase.token)
    readonly createMessage: CreateMessageUseCase,
    @inject(CreateChannelUseCase.token)
    readonly createChannel: CreateChannelUseCase,
    @inject(CreatePrivateChannelUseCase.token)
    readonly createPrivateChannel: CreatePrivateChannelUseCase,
    @inject(SuggestUsersUseCase.token)
    readonly suggestUsers: SuggestUsersUseCase,
    @inject(GetMessagesUseCase.token) readonly getMessages: GetMessagesUseCase,
    @inject(GetPostsUseCase.token) readonly getPosts: GetPostsUseCase,
    @inject(GetProfileWithPostsUseCase.token)
    readonly getProfileWithPosts: GetProfileWithPostsUseCase,
    @inject(GetInteractionsUseCase.token)
    readonly getInteractions: GetInteractionsUseCase,
    @inject(GetUsersUseCase.token) readonly getUsers: GetUsersUseCase,
    @inject(GetChannelsUseCase.token) readonly getChannels: GetChannelsUseCase,
    @inject(GetStatsUseCase.token) readonly getStats: GetStatsUseCase,
    @inject(SearchUseCase.token) readonly search: SearchUseCase,
    @inject(GetThreadUseCase.token) readonly getThread: GetThreadUseCase,
    @inject(GetFilesUseCase.token) readonly getFiles: GetFilesUseCase,
    @inject(GetPollsUseCase.token) readonly getPolls: GetPollsUseCase,
    @inject(GetPollUseCase.token) readonly getPoll: GetPollUseCase,
    @inject(GetRevisionUseCase.token) readonly getRevision: GetRevisionUseCase
  ) {}
}

const plugin: Plugin = (context, inject) => {
  bind(context)
  const interactors = container.resolve(Interactors)
  inject('interactors', interactors)
}

type InteractorType = Pick<Interactors, keyof Interactors>

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $interactors: InteractorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $interactors: InteractorType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $interactors: InteractorType
  }
}
