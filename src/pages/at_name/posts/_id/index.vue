<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class extends Vue {}
</script>
<router>
  {
    path: '/@:name/posts/:id',
    redirect: '/posts/:id'
  }
</router>
