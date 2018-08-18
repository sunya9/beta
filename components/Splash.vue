<template>
  <div class="text-center">
    <h1 class="display-4">Welcome to Beta!</h1>
    <p class="lead">Web client for <a href="https://pnut.io">pnut.io</a>.</p>
    <p>
      <button type="button" @click="$auth.loginWith('pnut')" class="btn btn-primary btn-lg">
        Login with pnut.io
        <i class="fa fa-chevron-right"></i>
      </button>
    </p>
  </div>
</template>
