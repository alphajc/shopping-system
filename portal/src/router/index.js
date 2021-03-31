import { createRouter, createWebHistory } from 'vue-router'
import store from '../store' // your vuex store

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '',
        name: 'ProductList',
        component: () => import('@/views/shopping/ProductList'),
        props: { msg: '欢迎来到网上购物中心' }
      },
      {
        path: 'order-list',
        name: 'OrderList',
        component: () => import('@/views/shopping/OrderList')
      }
    ],
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) {
        return next()
      }
      next('/login')
    }
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
