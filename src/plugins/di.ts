import querystring from 'querystring'
import { Plugin, Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
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
} from '~/plugins/domain/usecases/editPost'
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
  SuggestUsersInteracator,
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
  GetUsersIntereactor,
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
  SearchInteractors,
} from '~/plugins/domain/usecases/search'

type InteractorType = Readonly<{
  createFile: CreateFileUseCase
  createPoll: CreatePollUseCase
  getFile: GetFileUseCase
  createPost: CreatePostUseCase
  updatePost: UpdatePostUseCase
  createMessage: CreateMessageUseCase
  createChannel: CreateChannelUseCase
  createPrivateChannel: CreatePrivateChannelUseCase
  suggestUsers: SuggestUsersUseCase
  getMessages: GetMessagesUseCase
  getPosts: GetPostsUseCase
  getProfileWithPosts: GetProfileWithPostsUseCase
  getInteractions: GetInteractionsUseCase
  getUsers: GetUsersUseCase
  getChannels: GetChannelsUseCase
  getStats: GetStatsUseCase
  search: SearchUseCase
}>

function customizeAxios(axios: NuxtAxiosInstance) {
  axios.onRequest((config) => {
    config.paramsSerializer = (params) => {
      const entries = Object.entries(params).reduce<[string, any][]>(
        (obj, [key, value]) => {
          if (typeof value === 'undefined') return obj
          const newValue = typeof value === 'boolean' ? +value : value
          return obj.concat([[key, newValue]])
        },
        []
      )
      const obj = Object.fromEntries(entries)
      return querystring.stringify(obj)
    }
  })
}

function getInteractors(context: Context): InteractorType {
  customizeAxios(context.$axios)
  const getPnutRepository = () => {
    return new PnutRepositoryImpl(context.$axios)
  }
  return {
    get createFile() {
      return new CreateFileInteractor(getPnutRepository())
    },
    get createPoll() {
      return new CreatePollInteractor(getPnutRepository())
    },
    get getFile() {
      return new GetFileInteractor(getPnutRepository())
    },
    get createPost() {
      const pnutRepo = getPnutRepository()
      const postPolls = new CreatePollInteractor(pnutRepo)
      const uploadPhotos = new CreateFileInteractor(pnutRepo)
      return new CreatePostInteractor(pnutRepo, uploadPhotos, postPolls)
    },
    get updatePost() {
      return new UpdatePostInteractor(getPnutRepository())
    },
    get createMessage() {
      const pnutRepo = getPnutRepository()
      const createPoll = new CreatePollInteractor(pnutRepo)
      const createFile = new CreateFileInteractor(pnutRepo)
      const createPost = new CreatePostInteractor(
        pnutRepo,
        createFile,
        createPoll
      )
      return new CreateMessageInteractor(
        pnutRepo,
        createFile,
        createPoll,
        createPost
      )
    },

    get createChannel() {
      return new CreateChannelInteractor(getPnutRepository())
    },
    get createPrivateChannel() {
      const pnutRepo = getPnutRepository()
      const createPoll = new CreatePollInteractor(pnutRepo)
      const createFile = new CreateFileInteractor(pnutRepo)
      return new CreatePrivateChannelInteractor(
        getPnutRepository(),
        createFile,
        createPoll
      )
    },
    get suggestUsers() {
      return new SuggestUsersInteracator(getPnutRepository())
    },
    get getMessages() {
      return new GetMessagesInteractor(getPnutRepository())
    },
    get getPosts() {
      return new GetPostsInteractor(getPnutRepository())
    },
    get getProfileWithPosts() {
      const getPostsUseCase = new GetPostsInteractor(getPnutRepository())
      return new GetProfileWithPostsInteractor(
        getPnutRepository(),
        getPostsUseCase
      )
    },
    get getInteractions() {
      return new GetInteractionsInteractor(getPnutRepository())
    },
    get getUsers() {
      return new GetUsersIntereactor(getPnutRepository())
    },
    get getChannels() {
      return new GetChannelsInteractor(getPnutRepository())
    },
    get getStats() {
      return new GetStatsInteractor(getPnutRepository())
    },
    get search() {
      return new SearchInteractors(getPnutRepository())
    },
  }
}

const plugin: Plugin = (context, inject) => {
  const interactors = getInteractors(context)
  inject('interactors', interactors)
}

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
