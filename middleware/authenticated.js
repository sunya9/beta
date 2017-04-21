export default ({ store: { state }, redirect }) => {
  if (!state.user) {
    redirect('/')
  }
}
