<template>
  <p>Close window...</p>
</template>

<script>
import qs from 'querystring'
export default {
  mounted() {
    const paramsStr = this.$route.hash.substring(1)
    const params = qs.parse(paramsStr)
    const paramsJSON = JSON.stringify(params)
    localStorage.setItem('imgur', paramsJSON)
    window.close()
  }
}
</script>