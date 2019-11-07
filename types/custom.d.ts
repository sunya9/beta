import Vue from 'vue'

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

declare module '*.vue' {
  export default Vue
}
