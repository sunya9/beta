import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export class FilePreviewAbstract extends Vue {
  @Prop({ type: String, required: true })
  objectUrl!: string
}
