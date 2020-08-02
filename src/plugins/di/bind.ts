import { container } from 'tsyringe'
import { Context } from '@nuxt/types'
import {
  CreateFileInteractor,
  CreateFileUseCase,
} from '~/plugins/domain/usecases/createFile'
import { PnutRepositoryImpl } from '~/plugins/infrastructure/repository/pnutRepositoryImpl'
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
  GetProfileUseCase,
  GetProfileInteractor,
} from '~/plugins/domain/usecases/getProfile'
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
import {
  CreateConnectionUseCase,
  CreateConnectionInteractor,
} from '~/plugins/domain/usecases/createConnection'
import {
  GetUnreadCountUseCase,
  GetUnreadCountInteractor,
} from '~/plugins/domain/usecases/getUnreadCount'
import {
  MarkAsReadUseCase,
  MarkAsReadInteractor,
} from '~/plugins/domain/usecases/markAsRead'
import {
  UpdateRelationUseCase,
  UpdateRelationInteractor,
} from '~/plugins/domain/usecases/updateRelation'
import {
  UpdateProfileUseCase,
  UpdateProfileInteractor,
} from '~/plugins/domain/usecases/updateProfile'

export function bind(context: Context) {
  container
    .register(PnutRepository.token, {
      useValue: new PnutRepositoryImpl(context.$axios),
    })
    .register(GetProfileUseCase.token, {
      useClass: GetProfileInteractor,
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
    .register(GetProfileUseCase.token, { useClass: GetProfileInteractor })
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
    .register(CreateConnectionUseCase.token, {
      useClass: CreateConnectionInteractor,
    })
    .register(GetUnreadCountUseCase.token, {
      useClass: GetUnreadCountInteractor,
    })
    .register(MarkAsReadUseCase.token, { useClass: MarkAsReadInteractor })
    .register(UpdateRelationUseCase.token, {
      useClass: UpdateRelationInteractor,
    })
    .register(UpdateProfileUseCase.token, { useClass: UpdateProfileInteractor })
}
