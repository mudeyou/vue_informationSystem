import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome')
      },
      {
        //商品分类界面
        path: '/goods',
        component: () => import('../components/item1/Categories')
      },
      {
        //分类参数
        path: '/categories',
        component: () => import('../components/item1/Goods')
      },
      {
        //商品列表
        path: '/params',
        component: () => import('../components/item1/Params')
      },
      {
        path: '/orders',
        component: () => import('../components/item2/Orders')
      },
      {
        path: '/reports',
        component: () => import('../components/item3/Reports')
      },
      {
        path: '/goods/add',
        component: () => import('../components/item1/Add')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  // console.log(from);
  const sToken = window.sessionStorage.getItem('token')
  if (sToken) {
    next()
  } else {
    return next('/login')
  }
})

export default router
