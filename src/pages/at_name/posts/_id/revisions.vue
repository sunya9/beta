<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class extends Vue {}
</script>
<router>
  {
    path: '/@:name/posts/:id/revisions',
    redirect: '/posts/:id/revisions'
  }
</router>
