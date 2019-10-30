export interface Entity {
  amended_len: number;
  link: string;
  text: string;
  len: number;
  pos: number;
  title?: string;
}

export namespace Entity {
  export interface HaveEntity {
    text: string;
    html?: string;
    entity: Entity;
  }
}
