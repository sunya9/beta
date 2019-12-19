import { Poll } from '~/models/poll'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { LongPost } from '~/models/raw/raw/long-post'

const oneDayMin = 60 * 24
export function getMinimumPoll(): Poll.PostBody {
  return {
    prompt: '',
    type: 'net.unsweets.beta',
    options: [],
    duration: oneDayMin
  }
}

export function getMinimumSpoiler(): Spoiler.Value {
  return {
    topic: ''
  }
}

export function getMinimumLongPost(): LongPost.Value {
  return {
    body: '',
    tstamp: `${Date.now()}`
  }
}
