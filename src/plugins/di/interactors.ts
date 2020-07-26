import { inject, singleton } from 'tsyringe'
import { CreateFileUseCase } from '~/plugins/domain/usecases/createFile'
import { CreatePollUseCase } from '~/plugins/domain/usecases/createPoll'
import { GetFileUseCase } from '~/plugins/domain/usecases/getFile'
import { CreatePostUseCase } from '~/plugins/domain/usecases/createPost'
import { UpdatePostUseCase } from '~/plugins/domain/usecases/updatePost'
import { CreateMessageUseCase } from '~/plugins/domain/usecases/createMessage'
import { CreateChannelUseCase } from '~/plugins/domain/usecases/createChannel'
import { CreatePrivateChannelUseCase } from '~/plugins/domain/usecases/createPrivateChannel'
import { SuggestUsersUseCase } from '~/plugins/domain/usecases/suggestUsers'
import { GetMessagesUseCase } from '~/plugins/domain/usecases/getMessages'
import { GetPostsUseCase } from '~/plugins/domain/usecases/getPosts'
import { GetProfileWithPostsUseCase } from '~/plugins/domain/usecases/getProfileWithPosts'
import { GetInteractionsUseCase } from '~/plugins/domain/usecases/getInteractions'
import { GetUsersUseCase } from '~/plugins/domain/usecases/getUsers'
import { GetChannelsUseCase } from '~/plugins/domain/usecases/getChannels'
import { GetStatsUseCase } from '~/plugins/domain/usecases/getStats'
import { SearchUseCase } from '~/plugins/domain/usecases/search'
import { GetThreadUseCase } from '~/plugins/domain/usecases/getThread'
import { GetFilesUseCase } from '~/plugins/domain/usecases/getFiles'
import { GetPollsUseCase } from '~/plugins/domain/usecases/getPolls'
import { GetPollUseCase } from '~/plugins/domain/usecases/getPoll'
import { GetRevisionUseCase } from '~/plugins/domain/usecases/getRevision'
import { CreateConnectionUseCase } from '~/plugins/domain/usecases/createConnection'
import { GetUnreadCountUseCase } from '~/plugins/domain/usecases/getUnreadCount'
import { MarkAsReadUseCase } from '~/plugins/domain/usecases/markAsRead'
import { UpdateRelationUseCase } from '~/plugins/domain/usecases/updateRelation'

@singleton()
export class Interactors {
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
    @inject(GetRevisionUseCase.token) readonly getRevision: GetRevisionUseCase,
    @inject(CreateConnectionUseCase.token)
    readonly createConnection: CreateConnectionUseCase,
    @inject(GetUnreadCountUseCase.token)
    readonly getUnreadCount: GetUnreadCountUseCase,
    @inject(MarkAsReadUseCase.token) readonly markAsRead: MarkAsReadUseCase,
    @inject(UpdateRelationUseCase.token)
    readonly updateRelation: UpdateRelationUseCase
  ) {}
}
