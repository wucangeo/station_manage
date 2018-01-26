import MainView from '@/views/Main.vue'
import homeView from '@/views/home/home.vue'
import MainRouterIndexView from '@/views/main-router-index.vue'

//用户模块
import loginView from '@/views/user/login.vue'
import userListView from '@/views/user/user-list.vue'
import userInfoView from '@/views/user/user-info.vue'
import userAddView from '@/views/user/user-add.vue'

//台站简介
import introductionViewView from '@/views/station/introduction/intro-view.vue'
import introductionEditView from '@/views/station/introduction/intro-edit.vue'
import historyViewView from '@/views/station/history/history-view.vue'
import historyEditView from '@/views/station/history/history-edit.vue'
import regulationListView from '@/views/station/regulation/regulation-list.vue'
import regulationViewView from '@/views/station/regulation/regulation-view.vue'
import regulationEditView from '@/views/station/regulation/regulation-edit.vue'
import regulationAddView from '@/views/station/regulation/regulation-add.vue'

//新闻公告
import newsListView from '@/views/news/news-list.vue'
import newsViewView from '@/views/news/news-view.vue'
import newsEditView from '@/views/news/news-edit.vue'
import newsAddView from '@/views/news/news-add.vue'

//专题服务
import thematicListView from '@/views/thematic/thematic-list.vue'
import thematicViewView from '@/views/thematic/thematic-view.vue'
import thematicEditView from '@/views/thematic/thematic-edit.vue'
import thematicAddView from '@/views/thematic/thematic-add.vue'

//图片列表
import imageListView from '@/views/image/image-list.vue'
import imageViewView from '@/views/image/image-view.vue'

//成果----------------------------
//论文
import paperListView from '@/views/achv/paper/paper-list.vue'
import paperInfoView from '@/views/achv/paper/paper-info.vue'
import paperAddView from '@/views/achv/paper/paper-add.vue'
import paperEditView from '@/views/achv/paper/paper-edit.vue'
import paperTrashView from '@/views/achv/paper/paper-trash.vue'
//专著
import monographyListView from '@/views/achv/monography/monography-list.vue'
import monographyInfoView from '@/views/achv/monography/monography-info.vue'
import monographyAddView from '@/views/achv/monography/monography-add.vue'
import monographyEditView from '@/views/achv/monography/monography-edit.vue'
import monographyTrashView from '@/views/achv/monography/monography-trash.vue'
//专著
import patentListView from '@/views/achv/patent/patent-list.vue'
import patentInfoView from '@/views/achv/patent/patent-info.vue'
import patentAddView from '@/views/achv/patent/patent-add.vue'
import patentEditView from '@/views/achv/patent/patent-edit.vue'
import patentTrashView from '@/views/achv/patent/patent-trash.vue'
//专著
import awardsListView from '@/views/achv/awards/awards-list.vue'
import awardsInfoView from '@/views/achv/awards/awards-info.vue'
import awardsAddView from '@/views/achv/awards/awards-add.vue'
import awardsEditView from '@/views/achv/awards/awards-edit.vue'
import awardsTrashView from '@/views/achv/awards/awards-trash.vue'
//项目
import projectListView from '@/views/project/project-list.vue'
import projectInfoView from '@/views/project/project-info.vue'
import projectAddView from '@/views/project/project-add.vue'
import projectEditView from '@/views/project/project-edit.vue'
import projectTrashView from '@/views/project/project-trash.vue'

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
  redirect: { name: 'home' }
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/home',
    title: '首页',
    name: 'home',
    icon: 'ios-home',
    redirect: { name: 'home_index' },
    component: MainView,
    children: [
      {
        path: 'home',
        title: '首页',
        name: 'home_index',
        component: homeView
      }
    ]
  },
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
        component: MainRouterIndexView,
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
        component: MainRouterIndexView,
        children: [
          {
            path: 'view',
            name: 'stationHistoryView',
            title: '内容',
            component: historyViewView
          },
          {
            path: 'edit',
            name: 'stationHistoryEdit',
            title: '编辑',
            component: historyEditView
          }
        ]
      },
      {
        path: 'regulation',
        name: 'stationRegulation',
        title: '规章制度',
        redirect: { name: 'stationRegulationList' },
        component: MainRouterIndexView,
        children: [
          {
            path: 'list',
            name: 'stationRegulationList',
            title: '内容',
            component: regulationListView
          },
          {
            path: 'view/:data_id',
            name: 'stationRegulationView',
            title: '查看',
            component: regulationViewView
          },
          {
            path: 'edit/:data_id',
            name: 'stationRegulationEdit',
            title: '编辑',
            component: regulationEditView
          },
          {
            path: 'add',
            name: 'stationRegulationAdd',
            title: '编辑',
            component: regulationAddView
          }
        ]
      }
    ]
  },
  {
    path: '/news',
    icon: 'ios-paper',
    title: '新闻公告',
    name: 'news',
    redirect: { name: 'newsNotice' },
    component: MainView,
    children: [
      {
        path: 'notice',
        name: 'newsNotice',
        title: '通知公告',
        redirect: { name: 'newsNoticeList', params: { type: 1 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsNoticeList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsNoticeView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsNoticeEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsNoticeAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsNews',
        title: '综合新闻',
        redirect: { name: 'newsNewsList', params: { type: 2 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsNewsList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsNewsView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsNewsEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsNewsAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsResearch',
        title: '科研动态',
        redirect: { name: 'newsResearchList', params: { type: 3 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsResearchList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsResearchView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsResearchEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsResearchAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsService',
        title: '服务动态',
        redirect: { name: 'newsServiceList', params: { type: 4 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsServiceList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsServiceView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsServiceEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsServiceAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsExchange',
        title: '合作交流',
        redirect: { name: 'newsExchangeList', params: { type: 5 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsExchangeList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsExchangeView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsExchangeEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsExchangeAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsPopularization',
        title: '科普活动',
        redirect: { name: 'newsPopularizationList', params: { type: 6 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsPopularizationList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsPopularizationView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsPopularizationEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsPopularizationAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      },
      {
        path: 'news',
        name: 'newsReport',
        title: '专题报道',
        redirect: { name: 'newsReportList', params: { type: 7 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'newsReportList',
            title: '列表',
            component: newsListView
          },
          {
            path: ':type/view/:data_id',
            name: 'newsReportView',
            title: '查看',
            component: newsViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'newsReportEdit',
            title: '编辑',
            component: newsEditView
          },
          {
            path: ':type/add',
            name: 'newsReportAdd',
            title: '添加',
            component: newsAddView
          }
        ]
      }
    ]
  },
  {
    path: '/science-achv',
    icon: 'ios-paper',
    title: '科研成果',
    name: 'science_achv',
    redirect: { name: 'paperIndex' },
    component: MainView,
    children: [
      {
        path: 'paper',
        name: 'paperIndex',
        title: '科研论文',
        redirect: { name: 'paperList' },
        component: MainRouterIndexView,
        children: [
          {
            path: 'list',
            name: 'paperList',
            title: '全部论文',
            component: paperListView
          },
          {
            path: 'trash',
            name: 'paperTrash',
            title: '回收站',
            component: paperTrashView
          },
          {
            path: 'info/:data_id',
            name: 'paperInfo',
            title: '论文详情',
            component: paperInfoView
          },
          {
            path: 'add',
            name: 'paperAdd',
            title: '添加论文',
            component: paperAddView
          },
          {
            path: 'edit/:data_id',
            name: 'paperEdit',
            title: '编辑论文',
            component: paperEditView
          }
        ]
      },
      {
        path: 'monography',
        name: 'monographyIndex',
        title: '专著',
        redirect: { name: 'monographyList' },
        component: MainRouterIndexView,
        children: [
          {
            path: 'list',
            name: 'monographyList',
            title: '全部专著',
            component: monographyListView
          },
          {
            path: 'trash',
            name: 'monographyTrash',
            title: '回收站',
            component: monographyTrashView
          },
          {
            path: 'info/:data_id',
            name: 'monographyInfo',
            title: '专著信息',
            component: monographyInfoView
          },
          {
            path: 'add',
            name: 'monographyAdd',
            title: '添加专著',
            component: monographyAddView
          },
          {
            path: 'edit/:data_id',
            name: 'monographyEdit',
            title: '编辑专著',
            component: monographyEditView
          }
        ]
      },
      {
        path: 'patent',
        name: 'patentIndex',
        title: '专利',
        redirect: { name: 'patentList' },
        component: MainRouterIndexView,
        children: [
          {
            path: 'list',
            name: 'patentList',
            title: '全部专利',
            component: patentListView
          },
          {
            path: 'trash',
            name: 'patentTrash',
            title: '回收站',
            component: patentTrashView
          },
          {
            path: 'info/:data_id',
            name: 'patentInfo',
            title: '专利信息',
            component: patentInfoView
          },
          {
            path: 'add',
            name: 'patentAdd',
            title: '添加专利',
            component: patentAddView
          },
          {
            path: 'edit/:data_id',
            name: 'patentEdit',
            title: '编辑专利',
            component: patentEditView
          }
        ]
      },
      {
        path: 'awards',
        name: 'awardsIndex',
        title: '奖项',
        redirect: { name: 'awardsList' },
        component: MainRouterIndexView,
        children: [
          {
            path: 'list',
            name: 'awardsList',
            title: '全部奖项',
            component: awardsListView
          },
          {
            path: 'trash',
            name: 'awardsTrash',
            title: '回收站',
            component: awardsTrashView
          },
          {
            path: 'info/:data_id',
            name: 'awardsInfo',
            title: '奖项信息',
            component: awardsInfoView
          },
          {
            path: 'add',
            name: 'awardsAdd',
            title: '添加奖项',
            component: awardsAddView
          },
          {
            path: 'edit/:data_id',
            name: 'awardsEdit',
            title: '编辑奖项',
            component: awardsEditView
          }
        ]
      }
    ]
  },
  {
    path: '/project',
    icon: 'ios-paper',
    title: '科研项目',
    name: 'project',
    redirect: { name: 'kjbProject' },
    component: MainView,
    children: [
      {
        path: 'kjb',
        name: 'kjbProject',
        title: '科技部项目',
        redirect: { name: 'kjbProjectList', params: { type: 1 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'kjbProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'kjbProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'kjbProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'kjbProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'kjbProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      },
      {
        path: 'jjw',
        name: 'jjwProject',
        title: '基金委项目',
        redirect: { name: 'jjwProjectList', params: { type: 2 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'jjwProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'jjwProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'jjwProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'jjwProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'jjwProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      },
      {
        path: 'zky',
        name: 'zkyProject',
        title: '中科院项目',
        redirect: { name: 'zkyProjectList', params: { type: 3 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'zkyProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'zkyProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'zkyProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'zkyProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'zkyProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      },
      {
        path: 'qtbw',
        name: 'qtbwProject',
        title: '其他部委项目',
        redirect: { name: 'qtbwProjectList', params: { type: 4 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'qtbwProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'qtbwProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'qtbwProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'qtbwProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'qtbwProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      },
      {
        path: 'df',
        name: 'dfProject',
        title: '地方项目',
        redirect: { name: 'dfProjectList', params: { type: 5 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'dfProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'dfProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'dfProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'dfProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'dfProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      },
      {
        path: 'qt',
        name: 'qtProject',
        title: '其他项目',
        redirect: { name: 'qtProjectList', params: { type: 6 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'qtProjectList',
            title: '列表',
            component: projectListView
          },
          {
            path: ':type/trash',
            name: 'qtProjectTrash',
            title: '回收站',
            component: projectTrashView
          },
          {
            path: ':type/info/:data_id',
            name: 'qtProjectInfo',
            title: '查看',
            component: projectInfoView
          },
          {
            path: ':type/edit/:data_id',
            name: 'qtProjectEdit',
            title: '编辑',
            component: projectEditView
          },
          {
            path: ':type/add',
            name: 'qtProjectAdd',
            title: '添加',
            component: projectAddView
          }
        ]
      }
    ]
  },
  {
    path: '/thematic',
    icon: 'ios-paper',
    title: '专题服务',
    name: 'thematic',
    redirect: { name: 'thematicProduction' },
    component: MainView,
    children: [
      {
        path: 'production',
        name: 'thematicProduction',
        title: '生产与实践',
        redirect: { name: 'thematicProductionList', params: { type: 4 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'thematicProductionList',
            title: '列表',
            component: thematicListView
          },
          {
            path: ':type/view/:data_id',
            name: 'thematicProductionView',
            title: '查看',
            component: thematicViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'thematicProductionEdit',
            title: '编辑',
            component: thematicEditView
          },
          {
            path: ':type/add',
            name: 'thematicProductionAdd',
            title: '添加',
            component: thematicAddView
          }
        ]
      },
      {
        path: 'science',
        name: 'thematicScience',
        title: '服务科学研究',
        redirect: { name: 'thematicScienceList', params: { type: 5 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'thematicScienceList',
            title: '列表',
            component: thematicListView
          },
          {
            path: ':type/view/:data_id',
            name: 'thematicScienceView',
            title: '查看',
            component: thematicViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'thematicScienceEdit',
            title: '编辑',
            component: thematicEditView
          },
          {
            path: ':type/add',
            name: 'thematicScienceAdd',
            title: '添加',
            component: thematicAddView
          }
        ]
      }
    ]
  },
  {
    path: '/scientific',
    icon: 'ios-paper',
    title: '科学普及',
    name: 'scientific',
    redirect: { name: 'scientificProduction' },
    component: MainView,
    children: [
      {
        path: 'knowledge',
        name: 'scientificKnowledge',
        title: '科普知识',
        redirect: { name: 'scientificKnowledgeList', params: { type: 6 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'scientificKnowledgeList',
            title: '列表',
            component: thematicListView
          },
          {
            path: ':type/view/:data_id',
            name: 'scientificKnowledgeView',
            title: '查看',
            component: thematicViewView
          },
          {
            path: ':type/edit/:data_id',
            name: 'scientificKnowledgeEdit',
            title: '编辑',
            component: thematicEditView
          },
          {
            path: ':type/add',
            name: 'scientificKnowledgeAdd',
            title: '添加',
            component: thematicAddView
          }
        ]
      },

      {
        path: 'image',
        name: 'scientificImage',
        title: '生态图片',
        redirect: { name: 'scientificImageList', params: { type: 1 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'scientificImageList',
            title: '列表',
            component: imageListView
          },
          {
            path: ':type/view/:data_id',
            name: 'scientificImageView',
            title: '查看',
            component: imageViewView
          }
        ]
      }
    ]
  },
  {
    path: '/scenery',
    icon: 'ios-paper',
    title: '台站风光',
    name: 'scenery',
    redirect: { name: 'sceneryImage' },
    component: MainView,
    children: [
      {
        path: 'image',
        name: 'sceneryImage',
        title: '生态图片',
        redirect: { name: 'sceneryImageList', params: { type: 2 } },
        component: MainRouterIndexView,
        children: [
          {
            path: ':type/list',
            name: 'sceneryImageList',
            title: '列表',
            component: imageListView
          },
          {
            path: ':type/view/:data_id',
            name: 'sceneryImageView',
            title: '查看',
            component: imageViewView
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
        component: MainRouterIndexView,
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
