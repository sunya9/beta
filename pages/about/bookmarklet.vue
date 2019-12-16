<template>
  <div class="card">
    <div class="card-body">
      <h1 class="h3 card-title">
        Share a link on pnut.io
      </h1>
      <a :href="shareScript" class="btn btn-primary">
        Share on pnut.io
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const shareScript = `
javascript:(function(){var D=550,A=450,C=screen.height,B=screen.width,H=Math.round((B/2)-(D/2)),G=0,W=window;if(C>A){G=Math.round((C/2)-(A/2))}W.open('https://beta.pnut.io/intent/post?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(W.location),'','left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1');}());
`

export default Vue.extend({
  data() {
    return {
      shareScript
    }
  },
  head: {
    title: 'Bookmarklet'
  }
})
</script>
