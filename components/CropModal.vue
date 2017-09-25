<template>
  <div class="modal fade">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Crop image</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img  alt="" class="img-fluid" ref="img">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button @click="crop" type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'

// let Croppie
// if (process.BROWSER_BUILD) {
//   Croppie = require('croppie')
// }

export default {
  mounted() {

  },
  methods: {
    crop() {
      this.save()
    },
    open(base64img, opt, callback) {
      // $(this.$el).modal('show')
      // const croppie = new Croppie(this.$refs.img, opt)
      // croppie.bind({
      //   url: base64img
      // })
      // return croppie
    }
  }
}
</script>