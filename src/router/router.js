import MainView from '@/views/Main.vue'
import loginView from '@/views/user/login.vue'
import userIndexView from '@/views/user/user-index.vue'
import userListView from '@/views/user/user-list.vue'
import userInfoView from '@/views/user/user-info.vue'
import userAddView from '@/views/user/user-add.vue'

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
  component: resolve => {
    require(['@/views/error-page/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => {
    require(['@//views/error-page/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views/error-page/500.vue'], resolve)
  }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: MainView,
  children: [
    {
      path: 'home',
      title: { i18n: 'home' },
      name: 'home_index',
      component: resolve => {
        require(['@/views/home/home.vue'], resolve)
      }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/group',
    icon: 'ios-folder',
    name: 'group',
    title: '组',
    component: MainView,
    children: [
      {
        path: 'page1',
        icon: 'ios-paper-outline',
        name: 'page1',
        title: '第一页',
        component: resolve => {
          require(['@/views/group/page1/page1.vue'], resolve)
        },
        children: [
          {
            path: 'page11',
            icon: 'ios-paper-outline',
            name: 'page11',
            title: '第11页',
            component: resolve => {
              require(['@/views/group/page1/page11.vue'], resolve)
            }
          }
        ]
      },
      {
        path: 'page2',
        icon: 'ios-list-outline',
        name: 'page2',
        title: 'Page2',
        component: resolve => {
          require(['@/views/group/page2/page2.vue'], resolve)
        }
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
