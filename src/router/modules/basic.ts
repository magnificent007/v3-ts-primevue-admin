import type { RouteRecordRaw } from 'vue-router'

export const basicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/layout/home',
  },
  {
    path: '/layout',
    name: 'Layout',
    meta: {
      title: '商户管理',
    },
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        meta: {
          title: '首页',
        },
        component: () => import('@/views/home/home.vue'),
      },
      {
        path: 'about',
        name: 'About',
        meta: {
          title: '关于',
        },
        component: () => import('@/views/about/about.vue'),
      },
    ],
  },
  {
    path: '/course',
    name: 'Course',
    meta: {
      title: '课程管理',
    },
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: 'chapter',
        name: 'Chapter',
        meta: {
          title: '章管理',
        },
        component: () => import('@/views/course/chapter/chapter.vue'),
      },
    ],
  },
]

export default basicRoutes
