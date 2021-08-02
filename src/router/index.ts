import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '/',
    // name: 'home',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */ '@/views/role/index.vue')
      },
      {
        path: '/role/:roleId/allocMenu',
        name: 'allocMenu',
        component: () => import(/* webpackChunkName: "allocMenu" */ '@/views/role/allocMenu.vue'),
        props: true// 将路由路径参数映射到组件的 props 选项中 —— 推荐使用
      },
      {
        path: '/role/:roleId/allocResource',
        name: 'allocResource',
        component: () => import(/* webpackChunkName: "allocResource" */'@/views/role/allocResource.vue'),
        props: true
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu" */ '@/views/menu/index.vue')
      },
      {
        path: '/menu/create',
        name: 'menuCreate',
        component: () => import(/* webpackChunkName: "menu-update" */ '@/views/menu/create.vue')
      },
      {
        path: '/menu/:id/edit',
        name: 'menuEdit',
        component: () => import(/* webpackChunkName: "menu-update" */ '@/views/menu/create.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: "resource" */ '@/views/resource/index.vue')
      },
      {
        path: '/category',
        name: 'category',
        component: () => import(/* webpackChunkName: "category" */ '@/views/resource/category.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: "course" */ '@/views/course/index.vue')
      },
      {
        path: '/course/add',
        name: 'courseAdd',
        component: () => import(/* webpackChunkName: "courseAdd" */ '@/views/course/detail.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "advert" */ '@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: "advert-space" */ '@/views/advert-space/index.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    // redirect: '/404',
    component: () => import(/* webpackChunkName: "advert-space" */ '@/views/error-page/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    // 路由守卫中一定要调用 next，否则页面无法显示
    next()
  }
})

export default router
