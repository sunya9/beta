import Vue from 'vue'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '../helper'
import SearchForm from '~/components/SearchForm.vue'

describe('SearchForm component', () => {
  let localVue: typeof Vue
  let router: VueRouter
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
    router = new VueRouter({
      routes: [
        {
          path: '/',
          name: 'index',
        },
        {
          path: '/search/posts',
          name: 'search-posts',
        },
        {
          path: '/search/users',
          name: 'search-users',
        },
      ],
    })
  })
  test('`q` query equals input initial value', () => {
    router.push('/search/posts')
    const emptyWrapper = shallowMount(SearchForm, {
      router,
      localVue,
    })
    expect((emptyWrapper.find('input').element as HTMLInputElement).value).toBe(
      ''
    )
    router.push('/search/posts?q=foo')
    const fooWrapper = shallowMount(SearchForm, {
      router,
      localVue,
    })
    expect((fooWrapper.find('input').element as HTMLInputElement).value).toBe(
      'foo'
    )
  })
  test('input value is updated when `q` is changed', async () => {
    const wrapper = shallowMount(SearchForm, {
      router,
      localVue,
    })
    await router.push('/search/posts')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    await router.push('/search/posts?q=foo')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
      'foo'
    )
  })
  test('search posts when is submitted on general or `search posts` pages', async () => {
    const wrapper = shallowMount(SearchForm, {
      router,
      localVue,
    })
    await router.push('/')

    wrapper.find('input').setValue('foo')
    wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$route.fullPath).toBe('/search/posts?q=foo')
    wrapper.find('input').setValue('bar')
    wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$route.fullPath).toBe('/search/posts?q=bar')
  })
  test('search users when is submitted on the `search users` page', async () => {
    const wrapper = shallowMount(SearchForm, {
      router,
      localVue,
    })
    await router.push('/search/users')
    wrapper.find('input').setValue('foo')
    wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$route.fullPath).toBe('/search/users?q=foo')
    wrapper.find('input').setValue('bar')
    wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$route.fullPath).toBe('/search/users?q=bar')
  })
})
