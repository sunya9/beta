<template>
  <div>
    <h3 class="card-title mb-4">
      Account
    </h3>
    <h4 class="card-subtitle">Profile</h4>
    <form @submit.prevent="update" action="/proxy/users/me" method="post">
      <input type="hidden" name="_method" value="patch">
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="name">
          Name
        </label>
        <div class="col-sm-12 col-md-9">
          <input type="text" id="name" name="name" v-model="name" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="description">
          Description
        </label>
        <div class="col-sm-12 col-md-9">
          <textarea v-model="description" name="content[text]" cols="30" rows="7" id="description" class="form-control"></textarea>
        </div>
      </div>
      <div class="form-group row">
        <div class="ml-md-auto col-md-9">
          <submit-button />
        </div>
      </div>
    </form>
    <div v-if="false">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h4>Cover</h4>
        </div>
        <div class="col-sm-12 col-md-9">
          <div class="form-group">
            <img :src="cover.link"
              :width="cover.width" :height="cover.height"
              alt="cover image" class="img-fluid">
          </div>
          <div class="form-group">
            <input
              type="file"
              accept="image/*"
              @change="coverChanged"
              style="display: none"
              ref="coverFileInput">
            <button
              type="button"
              @click="changeCover"
              class="btn btn-secondary mr-2">
              Change cover
            </button>
            {{coverMessage}}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h4>Avatar</h4>
        </div>
        <div class="col-ms-12 col-md-9">
          <div class="form-group">
            <img :src="avatar.link"
              width="128" height="128"
              alt="avatar image">
          </div>
          <div class="form-group">
            <input
              type="file"
              @change="avatarChanged"
              accept="image/*"
              style="display: none"
              ref="avatarFileInput">
            <button
              type="button"
              @click="changeAvatar"
              class="btn btn-secondary mr-2">
              Change avatar
            </button>
            {{avatarMessage}}
          </div>
        </div>
      </div>
    </div>
    <!-- <crop-modal ref="cropModal" /> -->
  </div>
</template>

<script>
import api from '~plugins/api'
import SubmitButton from '~components/SubmitButton'
// import CropModal from '~components/CropModal'

export default {
  props: {
    account: {}
  },
  data () {
    return {
      name: '',
      description: '',
      cover: {},
      avatar: {},
      coverMessage: '',
      avatarMessage: ''
    }
  },
  computed: {
    submitData () {
      return {
        name: this.name,
        content: {
          text: this.description
        }
      }
    }
  },
  async mounted () {
    const account = this.account
    this.name = account.name
    this.description = account.content.text
    this.cover = account.content.cover_image
    this.avatar = account.content.avatar_image
  },
  methods: {
    async update () {
      const { meta } = await api().patch('/users/me', this.submitData)
      if (meta.code === 200) {

      }
    },
    changeCover () {
      this.$refs.coverFileInput.click()
    },
    changeAvatar () {
      this.$refs.avatarFileInput.click()
    }
    // avatarChanged(e) {
    //   if(!e.target.files.length) return
    //   const [file] = e.target.files
    //   const fr = new FileReader()
    //   console.log(file)
    //   const over2mb = file.size > 2048000
    //   if(over2mb) {
    //     this.coverMessage = 'Over 1MB.'
    //     return
    //   }
    //     const fd = new FormData()
    //     fd.append('avatar', file)
    //     axios.post('/proxy/users/me/avatar', {
    //         Avatar: file
    //       }, {
    //       headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //         'Content-Length': file.size
    //       }
    //     })
    //     .then(console.log)
    //     .catch(console.error.bind(console))
    // },
    // coverChanged(e) {
    //   if(!e.target.files.length) return
    //   const [file] = e.target.files
    //   const fr = new FileReader()
    //   console.log(file)
    //   const over4mb = file.size > 4096000
    //   if(over4mb) {
    //     this.coverMessage = 'Over 4MB.'
    //     return
    //   }
    //   fr.addEventListener('load', this.loadImage({
    //     viewport: {
    //       width: 300,
    //       height: 300
    //     },
    //     showZoomer: false
    //   }))
    //   fr.readAsDataURL(file)
    //     const fd = new FormData()
    //     fd.append('Avatar', file)
    //     axios.post('/proxy/users/me/cover', fd, {
    //       headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //       }
    //     })
    //     .then(console.log)
    //     .catch(console.error.bind(console))
    // },
    // loadImage(option) {
    //   return async e => {
    //     const { result: base64img } = e.target
    //     const img = new Image()
    //     img.src = base64img
    //     await new Promise(resolve => {
    //       img.addEventListener('load', resolve)
    //     })

    //     const width = 300 || window.innerWidth * 0.8
    //     const height = 300 || window.innerHeight * 0.8
    //     console.log(width, height)
    //     console.log(width, height, img)
    //     // Object.assign(option, {
    //     //   boundary: {
    //     //     width, height
    //     //   }
    //     // })
    //     this.$refs.cropModal.open(base64img, option).result('blob').then(blob => {
    //       console.log(blob)
    //     })
    //   }
    // }
  },
  components: {
    SubmitButton
    // CropModal
  }
}
</script>
