<template>
  <p>Close window...</p>
</template>

<script>
import qs from 'querystring'
import { setToken } from '~/assets/js/imgur'

export default {
  mounted () {
    const paramsStr = this.$route.hash.substring(1)
    const params = qs.parse(paramsStr)
    setToken(params)
    window.close()
  }
}
</script>