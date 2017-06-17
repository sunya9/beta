
export const setToken = tokenInfo => {
  // set expiry date
  const storedTokenInfo = Object.assign({}, tokenInfo)
  storedTokenInfo.expiryDate = Date.now() + storedTokenInfo.expires_in * 1000
  const storedTokenStr = JSON.stringify(storedTokenInfo)
  localStorage.setItem('imgur', storedTokenStr)
}
