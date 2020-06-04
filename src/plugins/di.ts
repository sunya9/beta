import { Plugin, Context } from '@nuxt/types'
import { UploadPhotosInteractor } from '~/plugins/domain/usecases/uploadPhotos'
import { PnutRepositoryImpl } from '~/plugins/infrastructure/pnutRepositoryImpl'
import { PostPollInteractor } from '~/plugins/domain/usecases/postPoll'
import { GetFileInteractor } from '~/plugins/domain/usecases/getFile'

function getInteractors(context: Context) {
  const getPnutRepository = () => new PnutRepositoryImpl(context.$axios)
  const interactors = {
    get uploadPhotos() {
      return new UploadPhotosInteractor(getPnutRepository())
    },
    get postPolls() {
      return new PostPollInteractor(getPnutRepository())
    },
    get getFile() {
      return new GetFileInteractor(getPnutRepository())
    },
  } as const
  return interactors
}

const plugin: Plugin = (context, inject) => {
  const interactors = getInteractors(context)
  inject('interactors', interactors)
}

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $interactors: ReturnType<typeof getInteractors>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $interactors: ReturnType<typeof getInteractors>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $interactors: ReturnType<typeof getInteractors>
  }
}
