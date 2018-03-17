<template>
  <div class="card">
    <div class="card-body">
      <h1 class="h3 card-title">
        What is beta?
      </h1>
      <p class="card-text">Beta is a pnut.io app built with respect to Alpha, the official app.net client.</p>
      <p class="card-text">It is made by <nuxt-link to="@xyz">@xyz</nuxt-link> and the source code is <a href="https://github.com/sunya9/beta">published on Github</a>.</p>
      <p class="card-text">Most of the code is original, but part of the CSS mimics Alpha.</p>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'About'
  }
}
</script>
