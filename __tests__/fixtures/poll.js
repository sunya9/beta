const now = new Date()
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const options = Array(5)
  .fill()
  .map((option, i) => ({
    text: `option ${i + 1}`,
    position: i + 1
  }))

export default {
  closed_at: nextWeek,
  options,
  poll_id: '1',
  poll_token: 'poll_token',
  prompt: 'prompt message'
}

export const detail = {
  created_at: now,
  is_public: true,
  is_anonymous: false,
  id: '1'
}

export const closed = {
  closed_at: oneDayAgo
}

export const responded = {
  you_responded: true,
  options: options.map((option, i) => {
    option.is_your_response = !i
    option.respondents = +!i
    return option
  })
}
