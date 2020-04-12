# Beta

[![Build Status](https://travis-ci.com/sunya9/beta.svg?branch=master)](https://travis-ci.com/sunya9/beta)
[![dependencies Status](https://david-dm.org/sunya9/beta/status.svg)](https://david-dm.org/sunya9/beta)
[![devDependencies Status](https://david-dm.org/sunya9/beta/dev-status.svg)](https://david-dm.org/sunya9/beta?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/fdb75749d11567b69c97/maintainability)](https://codeclimate.com/github/sunya9/beta/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fdb75749d11567b69c97/test_coverage)](https://codeclimate.com/github/sunya9/beta/test_coverage)

pnut.io client.

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install*[see note below]

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

\*Note: Due to a bug in yarn's engine version detection code if you are
using a prerelease version of Node (i.e. v7.6.0-rc.1) you will need to either:

1. Use `npm install`
2. Run `yarn` with a standard release of Node and then switch back

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Client Setup

Set up a client in the pnut.io developer area.

Set environment variables referenced in [example.env](example.env).
