import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  watchQuery: true,
  key: (to) => to.fullPath,
})
export class Search extends Vue {
  readonly keyword!: string
  readonly title!: string
}
