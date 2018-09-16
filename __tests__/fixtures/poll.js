const now = new Date()
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

export default {
  closed_at: nextWeek,
  created_at: now,
  id: '1',
  is_anonymous: false,
  is_public: true,
  options: Array(5)
    .fill()
    .map((option, i) => ({
      text: `option ${i + 1}`,
      position: i + 1
    })),
  poll_id: '1',
  poll_token: 'poll_token'
}
