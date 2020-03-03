import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import(/* webpackChunkName: "about" */ '../views/preview.vue'),
    meta: {
      title: '表单预览'
    }
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/editor/index.vue'),
    // children: [
    //   {
    //     path: ':id',
    //     component: () => import('../views/editor/index.vue'),
    //     meta: {
    //       title: '表单编辑器'
    //     }
    //   }
    // ],
    meta: {
      title: '表单编辑器'
    }
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  // if (!to.meta.menu) {
  //   window.JSBridge && window.JSBridge.noMenu()
  // }
  next()
})

export default router
