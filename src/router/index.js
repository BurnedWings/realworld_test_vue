import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta:{isLogin:true}
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta:{isLogin:false}
  },
  {
    path: '/createArticle',
    name: 'createArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateArticle'),
    meta:{isLogin:false}
  },
  {
    path: '/detailArticle/:articleId',
    name: 'detailArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailArticle')
  },
  {
    path: '/userView/:userId',
    name: 'userView',
    redirect:'/userView/:userId/userArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserView'),
    children:[
      {
        path:'userArticle',
        name:'userArticle',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserArticle')
      },
      {
        path:'userTrends',
        name:'userTrends',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserTrends')
      },
      {
        path:'userConcern',
        name:'userConcern',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserConcern')
      },
      {
        path:'userFans',
        name:'userFans',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserFans')
      },
      {
        path:'userInfo',
        name:'userInfo',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserInfo')
      },
    ]
    
  },
  {
    path: '/messageView',
    name: 'messageView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MessageView')
  },
  {
    path: '/collectionView',
    name: 'collectionView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CollectionView')
  },
  {
    path: '/trendsView',
    name: 'trendsView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TrendsView')
  },
  {
    path:'/userSetting',
    name:'userSetting',
    redirect:'/userSetting/infoView',
    component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting'),
    children:[
      {
        path:'infoView',
        name:'infoView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/InfoView')
      },
      {
        path:'accountView',
        name:'accountView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/AccountView')
      },
      {
        path:'emailView',
        name:'emailView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/EmailView')
      },
      {
        path:'aboutView',
        name:'aboutView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/AboutView')
      },
    ]
  }
]

const router = new VueRouter({
  mode:'history',
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   //返回的这个y=0，代表的滚动条在最上方
  //   return { y: 0 };
  // },
})

//解决重复点击相同路由异常
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this,to).catch(err=>err)
}

// router.beforeEach(async (to,from,next)=>{
//   let userInfo = store.state.user.userInfo
//   //已登录
//   if(userInfo){
//     if(to.path=="/login"||to.path=='/register'){
//       next('/');
//    }else{

//    }
//   }else{
//     //未登录

//   }
// })


export default router
