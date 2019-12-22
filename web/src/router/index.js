import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'index'}
    },
    {
      path: '/:id',
      name: 'index',
      component: Index
    }
  ]
})
