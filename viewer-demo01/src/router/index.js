import Vue from 'vue'
import VueRouter from 'vue-router'
// import Viewer from '../components/Viewer/index.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/viewer',
  //   name: 'Viewer',
  //   component: Viewer
  // }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // 路由级代码拆分会为此路由生成一个单独的块（约[hash] .js），该块在访问该路由时会被延迟加载。
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
