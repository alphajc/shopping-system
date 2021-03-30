import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('@/views/Home')
const ProductList = () => import('@/views/shopping/ProductList')
const OrderList = () => import('@/views/shopping/OrderList')
import store from '../store' // your vuex store

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: 'ProductList',
        component: ProductList,
        props: { msg: '欢迎来到网上购物中心' }
      },
      {
        path: 'order-list',
        name: 'OrderList',
        component: OrderList
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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
