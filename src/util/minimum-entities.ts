import { Poll } from '~/entity/poll'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import { LongPost } from '~/entity/raw/raw/long-post'

const oneDayMin = 60 * 24
export function getMinimumPoll(): Poll.PostBody {
  return {
    prompt: '',
    type: 'net.unsweets.beta',
    options: [],
    duration: oneDayMin,
  }
}

export function getMinimumSpoiler(): Spoiler.Value {
  return {
    topic: '',
  }
}

export function getMinimumLongPost(): LongPost.Value {
  return {
    body: '',
    tstamp: `${Date.now()}`,
  }
}
