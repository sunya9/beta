import { Plugin } from '@nuxt/types'
import {
  UploadPhotosUseCase,
  UploadPhotosInteractor,
} from '~/plugins/domain/usecases/uploadPhotos'
import { PnutRepositoryImpl } from '~/plugins/infrastructure/pnutRepositoryImpl'

interface Interactors {
  uploadPhotos: UploadPhotosUseCase
}

const plugin: Plugin = (context, inject) => {
  const getPnutRepository = () => new PnutRepositoryImpl(context.$axios)
  const interactors: Interactors = {
    get uploadPhotos() {
      return new UploadPhotosInteractor(getPnutRepository())
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
