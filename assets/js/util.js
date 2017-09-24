export function getTitle ({ username, name }) {
  return name
    ? `${name}(@${username})`
    : `@${username}`
}
