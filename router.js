import Vue from 'vue'
import Router from 'vue-router'
import postPage from '~/pages/posts/_id.vue'
Vue.use(Router)

function fixRoutes(defaultRoutes) {
  const routes = defaultRoutes.reduce((routes, route) => {
    // Replace "at" prefix with @ because cannot use @ for file/dir name in nuxt's project.
    if (route.name && route.name.startsWith('at_name')) {
      route.name = route.name.replace(/^at_name/, '@name')
      route.path = route.path.replace(/^\/at_/, '/@:')
    }
    routes.push(route)
    return routes
  }, [])
  routes.push({
    name: '@name-posts-id',
    path: '/@:name/posts/:id?',
    component: postPage
  })
  return routes
}

export function createRouter(ssrContext, createDefaultRouter) {
  const defaultRouter = createDefaultRouter(ssrContext)
  return new Router({
    ...defaultRouter.options,
    routes: fixRoutes(defaultRouter.options.routes)
  })
}
