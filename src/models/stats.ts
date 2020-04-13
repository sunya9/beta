export interface Stats {
  counts: Stats.Counts
}

export namespace Stats {
  export interface Counts {
    clients: {
      created: number
      public: number
    }
    days: number
    files: {
      created: number
    }
    messages: {
      created: number
    }
    posts: {
      created: number
    }
    users: {
      created: number
      disabled: number
      present: number
      today: number
    }
    polls: {
      created: number
    }
  }
}
