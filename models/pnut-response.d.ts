export interface PnutResponse<T> {
  meta: PnutResponse.Meta;
  data: T;
  code: number;
}

export namespace PnutResponse {
  interface Meta {
    more?: boolean;
    max_id?: string;
    min_id?: string;
    marker?: Meta.Marker;
  }
  export namespace Meta {
    interface Marker {
      id?: string;
      last_read_id?: string;
      percentage?: string;
      updated_at?: Date;
      version?: string;
      name?: string;
    }
  }
}
