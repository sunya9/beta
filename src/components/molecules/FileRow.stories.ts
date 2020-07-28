import Router from 'vue-router'
import FileRow from './FileRow.vue'
import { File } from '~/models/file'
import { DeepPartial } from '~/../types'
export default { title: 'molecules/FileRow' }

function base() {
  return {
    components: { FileRow },
    router: new Router(),
  }
}

const file: DeepPartial<File> = {
  name: 'file',
  created_at: new Date('2020-01-01'),
  image_info: {},
  link: 'https://via.placeholder.com/256',
}

export const normal = () => ({
  ...base(),
  props: {
    file: {
      default: () => file,
    },
  },
  template: `
  <div class="table-responsive">
    <table class="table table-hover">
      <file-row
        :file="file"
      />
    </table>
  </div>
`,
})
