import { otherRouter, appRouter } from '@/router/router'
import Util from '@/libs/util'

const app = {
  state: {
    currentPath: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ], // 面包屑数组
    menuList: [],
    routers: [otherRouter, ...appRouter]
  },
  mutations: {
    updateMenulist(state) {
      state.menuList = appRouter
    },
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr
    }
  }
}

export default app
