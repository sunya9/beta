export interface Entity {
  text: string
  len: number
  pos: number
}

export namespace Entity {
  export interface Link extends Entity {
    title?: string
    amended_len?: number
    link: string
  }
  export interface Mention extends Entity {
    id: string
    is_copy: boolean
    is_leading: boolean
  }
  export type Tag = Entity
  export interface HaveEntity {
    text: string
    html?: string
    entities: {
      links: Link[]
      mentions: Mention[]
      tags: Tag[]
    }
  }
}
