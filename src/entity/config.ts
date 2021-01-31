export interface Config {
  message: {
    max_length: number
  }
  post: {
    max_length: number
    repost_max_length: number
    seconds_between_duplicates: number
  }
  rate_limit: {
    anonymous: {
      reads: number
      seconds_between_reset: number
    }
    authorized: {
      reads: number
      read_reset_seconds: number
      writes: number
      write_reset_seconds: number
    }
    seconds_banned: number
  }
  raw: {
    max_length: number
  }
  user: {
    description_max_length: number
    username_max_length: number
  }
}
