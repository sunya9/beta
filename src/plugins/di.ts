import { Plugin } from '@nuxt/types'
import {
  UploadPhotosUseCase,
  UploadPhotosInteractor,
} from '~/plugins/domain/usecases/uploadPhotos'
import { PnutRepositoryImpl } from '~/plugins/infrastructure/pnutRepositoryImpl'
import {
  PostPollInteractor,
  PostPollUseCase,
} from '~/plugins/domain/usecases/postPoll'

interface Interactors {
  uploadPhotos: UploadPhotosUseCase
  postPolls: PostPollUseCase
}

const plugin: Plugin = (context, inject) => {
  const getPnutRepository = () => new PnutRepositoryImpl(context.$axios)
  const interactors: Interactors = {
    get uploadPhotos() {
      return new UploadPhotosInteractor(getPnutRepository())
    },
    get postPolls() {
      return new PostPollInteractor(getPnutRepository())
    },
  }
  inject('interactors', interactors)
}

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $interactors: Interactors
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $interactors: Interactors
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $interactors: Interactors
  }
}
