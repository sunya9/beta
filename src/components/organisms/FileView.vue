<template>
  <div>
    <div v-if="file.image_info" class="text-center">
      <img
        :src="file.link"
        alt=""
        class="img-fluid img-thumbnail"
        style="max-height: 50vh;"
      />
    </div>

    <div
      v-else-if="file.video_info"
      class="embed-responsive embed-responsive-16by9"
    >
      <video class="embed-responsive-item" controls>
        <source :src="file.link" />
        <p>
          Your browser does not support the
          <code>video</code>
          element.
        </p>
      </video>
    </div>
    <div v-else-if="file.audio_info">
      <audio :src="file.link" controls class="w-100">
        <p>
          Your browser does not support the
          <code>audio</code>
          element.
        </p>
      </audio>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{{ file.id }}</td>
              </tr>
              <tr>
                <th>Created at</th>
                <td>{{ $dayjs(file.created_at).format('LLL') }}</td>
              </tr>
              <tr>
                <th>File token read</th>
                <td>{{ file.file_token_read }}</td>
              </tr>
              <tr>
                <th>is public</th>
                <td>{{ file.is_public }}</td>
              </tr>
              <tr>
                <th>Kind</th>
                <td>{{ file.kind }}</td>
              </tr>
              <template v-if="file.image_info">
                <tr>
                  <th>Width</th>
                  <td>{{ file.image_info.width }}px</td>
                </tr>
                <tr>
                  <th>Height</th>
                  <td>{{ file.image_info.height }}px</td>
                </tr>
              </template>
              <template v-if="file.video_info">
                <tr>
                  <th>
                    bitrate
                  </th>
                  <td>
                    {{ file.video_info.bitrate }}
                  </td>
                </tr>
                <tr>
                  <th>
                    duration
                  </th>
                  <td>
                    {{ file.video_info.duration }}
                  </td>
                </tr>
                <tr>
                  <th>
                    duration_string
                  </th>
                  <td>
                    {{ file.video_info.duration_string }}
                  </td>
                </tr>
                <tr>
                  <th>
                    height
                  </th>
                  <td>
                    {{ file.video_info.height }}
                  </td>
                </tr>
                <tr>
                  <th>
                    width
                  </th>
                  <td>
                    {{ file.video_info.width }}
                  </td>
                </tr>
              </template>
              <tr>
                <th>link</th>
                <td class="break-all">
                  <a :href="file.link">
                    {{ file.link }}
                  </a>
                </td>
              </tr>
              <tr>
                <th>link expires at</th>
                <td>{{ $dayjs(file.link_expires_at).format('LLL') }}</td>
              </tr>
              <tr>
                <th>link short</th>
                <td>
                  <a :href="file.link_short">
                    {{ file.link_short }}
                  </a>
                </td>
              </tr>
              <tr>
                <th>mime type</th>
                <td>{{ file.mime_type }}</td>
              </tr>
              <tr>
                <th>name</th>
                <td>{{ file.name }}</td>
              </tr>
              <tr>
                <th>sha256</th>
                <td class="break-all">{{ file.sha256 }}</td>
              </tr>
              <tr>
                <th>size</th>
                <td>{{ humanReadableSize }}({{ file.size }}Byte)</td>
              </tr>
              <tr>
                <th>source</th>
                <td><source-link :source="file.source" /></td>
              </tr>
              <tr>
                <th>type</th>
                <td>{{ file.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import convert from 'convert-units'
import { File } from '~/models/file'
import SourceLink from '~/components/atoms/SourceLink.vue'

@Component({
  components: { SourceLink },
})
export default class FileView extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  file!: File

  get humanReadableSize() {
    const res = convert(this.file.size).from('b').toBest()
    return `${res.val.toFixed(1)}${res.unit}`
  }
}
</script>
