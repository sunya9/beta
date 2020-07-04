import Vue from 'vue'
import Router from 'vue-router'
import postPage from '~/pages/posts/_id/index.vue'
Vue.use(Router)

function fixRoutes(defaultRoutes) {
  const routes = defaultRoutes.reduce((routes, route) => {
    // Replace "at" prefix with @ because cannot use @ for file/dir name in nuxt's project.
    if (route.path?.startsWith('/at_name')) {
      route.path = route.path.replace(/^\/at_/, '/@:')
      route.children = route.children.map((child) => {
        return {
          ...child,
          name: child.name.replace(/^at_name/, '@name'),
        }
      })
    }
    routes.push(route)
    return routes
  }, [])
  routes.push({
    name: '@name-posts-id',
    path: '/@:name/posts/:id?',
    component: postPage,
  })
  return routes
}

export function createRouter(ssrContext, createDefaultRouter) {
  const defaultRouter = createDefaultRouter(ssrContext)
  return new Router({
    ...defaultRouter.options,
    routes: fixRoutes(defaultRouter.options.routes),
  })
}
