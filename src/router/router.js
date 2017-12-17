import MainView from '@/views/Main.vue'
import homeView from '@/views/home/home.vue'

//用户模块
import loginView from '@/views/user/login.vue'
import userIndexView from '@/views/user/user-index.vue'
import userListView from '@/views/user/user-list.vue'
import userInfoView from '@/views/user/user-info.vue'
import userAddView from '@/views/user/user-add.vue'

//台站简介
import introductionViewView from '@/views/station/introduction/intro-view.vue'
import introductionEditView from '@/views/station/introduction/intro-edit.vue'

import error_404 from '@/views/error-page/404.vue'
import error_403 from '@/views/error-page/403.vue'
import error_500 from '@/views/error-page/500.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: loginView
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: error_404
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: error_403
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: error_500
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: MainView,
  children: [
    {
      path: 'home',
      title: '首页',
      name: 'home_index',
      component: homeView
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/station',
    icon: 'ios-paper',
    title: '站点介绍',
    name: 'station',
    redirect: { name: 'stationIntroduction' },
    component: MainView,
    children: [
      {
        path: 'introduction',
        name: 'stationIntroduction',
        title: '台站简介',
        redirect: { name: 'stationIntroductionView' },
        component: userIndexView,
        children: [
          {
            path: 'view',
            name: 'stationIntroductionView',
            title: '内容',
            component: introductionViewView
          },
          {
            path: 'edit',
            name: 'stationIntroductionEdit',
            title: '编辑',
            component: introductionEditView
          }
        ]
      },
      {
        path: 'history',
        name: 'stationHistory',
        title: '历史沿革',
        redirect: { name: 'stationHistoryView' },
        component: userIndexView,
        children: [
          {
            path: 'view',
            name: 'stationHistoryView',
            title: '内容',
            component: userListView
          },
          {
            path: 'edit',
            name: 'stationHistoryEdit',
            title: '编辑',
            component: userInfoView
          }
        ]
      }
    ]
  },
  {
    path: '/user',
    icon: 'ios-paper',
    title: '用户管理',
    name: 'user',
    redirect: { name: 'userIndex' },
    component: MainView,
    children: [
      {
        path: 'index',
        name: 'userIndex',
        title: '用户列表',
        redirect: { name: 'userList' },
        component: userIndexView,
        children: [
          {
            path: 'list',
            name: 'userList',
            title: '全部用户',
            component: userListView
          },
          {
            path: 'info/:data_id',
            name: 'userInfo',
            title: '用户信息',
            component: userInfoView
          },
          {
            path: 'add',
            name: 'userAdd',
            title: '添加用户',
            component: userAddView
          }
        ]
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
]
